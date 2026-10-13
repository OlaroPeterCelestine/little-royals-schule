let starting: Promise<void> | null = null;

export function startSchool(): Promise<void> {
  if (starting) return starting;
  starting = import("./nav")
    .then(() => import("./desk"))
    .then(() => import("./session"))
    .then(({ startSession }) => {
      startSession();
    });
  return starting;
}
