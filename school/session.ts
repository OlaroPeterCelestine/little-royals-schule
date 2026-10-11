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
  }
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
  const error = required<HTMLElement>("login-error");
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
    error.textContent = "";
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
    error.textContent = "";
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
    if (!person) {
      error.textContent = "No school account uses that email.";
      return;
    }
    if (person.status !== "Active") {
      error.textContent = "This account is still invited. The head teacher needs to activate it.";
      return;
    }
    if (!passwordInput.value) {
      error.textContent = "Enter your password.";
      return;
    }
    enter(person);
  });

  required<HTMLButtonElement>("login-forgot").addEventListener("click", () => {
    required<HTMLInputElement>("forgot-email").value = emailInput.value;
    required<HTMLElement>("forgot-note").textContent = "";
    showPanel("forgot-panel");
  });
  required<HTMLButtonElement>("forgot-back").addEventListener("click", () => {
    showPanel("login-panel");
  });
  required<HTMLFormElement>("forgot-panel").addEventListener("submit", (event) => {
    event.preventDefault();
    const note = required<HTMLElement>("forgot-note");
    const person = findStaff(required<HTMLInputElement>("forgot-email").value);
    note.className = `mt-3 min-h-4 text-xs ${person ? "text-emerald-600" : "text-rose-600"}`;
    note.textContent = person
      ? `Reset steps were sent to ${person.email}.`
      : "No school account uses that email.";
  });
}
