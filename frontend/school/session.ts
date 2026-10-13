export interface SchoolAccount {
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface AccountRequest {
  name: string;
  email: string;
}

declare global {
  interface Window {
    applySession?: (user: SchoolAccount) => void;
    requestAccount?: (user: AccountRequest) => void;
    signOutSchool?: () => void;
    __deskButtons?: string[];
  }
}

function deskToast(title: string, type: "loading" | "success" | "error" | "info", id: string) {
  window.dispatchEvent(
    new CustomEvent("desk:toast", {
      detail: { title, type, id, timeout: type === "loading" ? 0 : 3200 },
    }),
  );
}

function buttonBusy(id: string, busy: boolean) {
  const current = new Set(window.__deskButtons || []);
  if (busy) current.add(id);
  else current.delete(id);
  window.__deskButtons = Array.from(current);
  window.dispatchEvent(new CustomEvent("desk:button"));
}

function deskAlert(id: string, title: string, description: string, variant: "default" | "destructive") {
  window.dispatchEvent(new CustomEvent("desk:alert", { detail: { id, title, description, variant } }));
}

function clearAlert(id: string) {
  window.dispatchEvent(new CustomEvent("desk:alert", { detail: { id, clear: true } }));
}

function required<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing #${id}`);
  return node as T;
}

export function startSession(): void {
  const staff: SchoolAccount[] = [
    { email: "grace.achieng@littleroyals.school", name: "Grace Achieng", role: "Head teacher", status: "Active" },
    { email: "alvarez@littleroyals.school", name: "Ms. Alvarez", role: "Class teacher", status: "Active" },
    { email: "shah@littleroyals.school", name: "Mr. Shah", role: "Class teacher", status: "Active" },
    { email: "nguyen@littleroyals.school", name: "Dr. Nguyen", role: "Class teacher", status: "Active" },
    { email: "office@littleroyals.school", name: "Front office", role: "Registrar", status: "Active" },
    { email: "wanjiru@littleroyals.school", name: "Ms. Wanjiru", role: "Bursar", status: "Invited" },
  ];

  const screen = document.getElementById("login-screen");
  const emailInput = required<HTMLInputElement>("login-email");
  const passwordInput = required<HTMLInputElement>("login-password");
  const remember = required<HTMLButtonElement>("login-remember");

  function findStaff(email: string): SchoolAccount | undefined {
    const needle = email.trim().toLowerCase();
    return staff.find((person) => person.email === needle);
  }

  function showPanel(id: string): void {
    ["login-panel", "forgot-panel"].forEach((panelId) => {
      const panel = document.getElementById(panelId);
      if (!panel) return;
      const on = panelId === id;
      panel.classList.toggle("hidden", !on);
      panel.classList.toggle("flex", on);
    });
  }

  function enter(user: SchoolAccount): void {
    if (remember.getAttribute("aria-checked") === "true") {
      try {
        localStorage.setItem("littleroyals-session", JSON.stringify(user));
      } catch {
        /* storage can be blocked */
      }
    } else {
      try {
        localStorage.removeItem("littleroyals-session");
      } catch {
        /* storage can be blocked */
      }
    }
    window.applySession?.(user);
    document.documentElement.classList.add("signed-in");
    clearAlert("login-error");
    passwordInput.value = "";
  }

  window.signOutSchool = () => {
    try {
      localStorage.removeItem("littleroyals-session");
    } catch {
      /* storage can be blocked */
    }
    document.documentElement.classList.remove("signed-in");
    passwordInput.value = "";
    clearAlert("login-error");
    clearAlert("forgot-note");
    showPanel("login-panel");
    screen?.classList.remove("hidden");
  };

  remember.addEventListener("click", () => {
    const on = remember.getAttribute("aria-checked") !== "true";
    remember.setAttribute("aria-checked", on ? "true" : "false");
  });

  required<HTMLFormElement>("login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const person = findStaff(emailInput.value);
    const button = required<HTMLButtonElement>("login-submit");
    const label = required<HTMLElement>("login-submit-label");
    clearAlert("login-error");
    if (!person) {
      deskAlert("login-error", "Could not sign in", "No school account uses that email.", "destructive");
      return;
    }
    if (person.status !== "Active") {
      deskAlert("login-error", "Could not sign in", "This account is still invited. The head teacher needs to activate it.", "destructive");
      return;
    }
    if (!passwordInput.value) {
      deskAlert("login-error", "Could not sign in", "Enter your password.", "destructive");
      return;
    }
    button.disabled = true;
    label.textContent = "Signing in";
    buttonBusy("login-submit-icon", true);
    deskToast("Signing in", "loading", "desk-login");
    window.setTimeout(() => {
      button.disabled = false;
      label.textContent = "Log in";
      buttonBusy("login-submit-icon", false);
      enter(person);
      deskToast(`Signed in as ${person.name}`, "success", "desk-login");
    }, 600);
  });

  required<HTMLButtonElement>("login-forgot").addEventListener("click", () => {
    required<HTMLInputElement>("forgot-email").value = emailInput.value;
    clearAlert("forgot-note");
    showPanel("forgot-panel");
  });
  required<HTMLButtonElement>("forgot-back").addEventListener("click", () => {
    showPanel("login-panel");
  });
  required<HTMLFormElement>("forgot-panel").addEventListener("submit", (event) => {
    event.preventDefault();
    const button = required<HTMLButtonElement>("forgot-submit");
    const label = required<HTMLElement>("forgot-submit-label");
    const email = required<HTMLInputElement>("forgot-email").value;
    clearAlert("forgot-note");
    button.disabled = true;
    label.textContent = "Sending";
    buttonBusy("forgot-submit-icon", true);
    deskToast("Sending reset link", "loading", "desk-reset");
    window.setTimeout(() => {
      button.disabled = false;
      label.textContent = "Send reset link";
      buttonBusy("forgot-submit-icon", false);
      const person = findStaff(email);
      if (person) {
        deskAlert("forgot-note", "Reset link sent", `Reset steps were sent to ${person.email}.`, "default");
        deskToast("Reset link sent", "success", "desk-reset");
      } else {
        deskAlert("forgot-note", "No account found", "No school account uses that email.", "destructive");
        deskToast("No school account uses that email.", "error", "desk-reset");
      }
    }, 600);
  });
}
