let started = false;

export function startSchool(): void {
  if (started) return;
  started = true;
  void import("./little-angels-nav")
    .then(() => import("./eduos"))
    .then(() => import("./session"))
    .then(({ startSession }) => {
      startSession();
    });
}
