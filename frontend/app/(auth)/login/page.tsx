import { Suspense } from "react"
import { LoginPage } from "@/features/auth/login-page"

export default function Page() {
  return (
    <Suspense fallback={<main className="grid h-dvh place-items-center text-sm text-slate-600">Opening sign in</main>}>
      <LoginPage />
    </Suspense>
  )
}
