"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { school } from "@/config/school"
import { roleLabels } from "@/config/permissions"
import { Crest } from "@/components/shell/crest"
import { createSeed } from "@/features/records/seed"
import { useSession } from "@/features/records/session"

const EMAIL_KEY = "littleroyals-login-email"

export function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const signIn = useSession((state) => state.signIn)
  const accounts = createSeed().accounts.filter((account) => account.status === "active")
  const [email, setEmail] = useState(accounts[0]?.email ?? "")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState("")
  const [forgot, setForgot] = useState(false)
  const [forgotNote, setForgotNote] = useState("")
  const next = params.get("next")
  const destination = next && next.startsWith("/app") ? next : "/"

  return (
    <main id="login-screen" className="flex h-dvh items-center justify-center overflow-auto p-6 sm:p-10">
      <div className="flex w-full max-w-[980px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
        <aside className="relative hidden min-h-[640px] w-[42%] md:block">
          <img src="/login-hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/35" />
          <div className="relative flex h-full min-h-[640px] flex-col justify-between p-8 text-white">
            <div className="flex items-center gap-2.5">
              <Crest className="h-9 w-9 rounded-full bg-white/95 p-0.5" />
              <span className="text-sm font-semibold tracking-tight">{school.name}</span>
            </div>
            <div>
              <p className="max-w-[16rem] font-serif text-[1.65rem] leading-snug font-medium">“Simply all the tools that my team and I need.”</p>
              <p className="mt-5 text-sm font-semibold">Grace Achieng</p>
              <p className="text-xs text-white/75">Head teacher, {school.name}</p>
            </div>
          </div>
        </aside>
        <section className="flex min-h-[640px] flex-1 flex-col px-8 py-10 sm:px-14">
          {forgot ? (
            <form
              className="flex flex-1 flex-col items-center justify-center"
              onSubmit={(event) => {
                event.preventDefault()
                setForgotNote("Password reset is not connected to a mail provider. Use a development account and any password to sign in.")
              }}
            >
              <div className="w-full max-w-[360px]">
                <h1 className="text-center text-[1.65rem] font-semibold tracking-tight text-slate-900">Reset your password</h1>
                <p className="mx-auto mt-2 max-w-[280px] text-center text-sm leading-relaxed text-slate-500">Reset mail is not connected for this school yet.</p>
                <label className="mt-8 block text-xs font-medium text-slate-500">
                  Email
                  <input type="email" required defaultValue={email} className="login-input mt-1.5" />
                </label>
                <p className="mt-3 min-h-4 text-xs text-slate-600" role="status">
                  {forgotNote}
                </p>
                <button type="submit" className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#7B61FF] py-2.5 text-sm font-semibold text-white hover:bg-[#684cf0]">
                  Send reset link
                </button>
                <button type="button" className="mt-4 w-full text-sm font-medium text-[#7B61FF]" onClick={() => setForgot(false)}>
                  Back to log in
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="w-full max-w-[360px]">
                <div className="mb-6 flex items-center justify-center gap-2 md:hidden">
                  <Crest className="h-10 w-10" alt={school.name} />
                </div>
                <h1 className="text-center text-[1.65rem] font-semibold tracking-tight text-slate-900">Welcome back to {school.name}</h1>
                <p className="mx-auto mt-2 max-w-[280px] text-center text-sm leading-relaxed text-slate-500">Sign in to the school office for this term.</p>
                <form
                  className="mt-8 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const result = signIn(email, password)
                    if (!result.ok) {
                      setError(result.error)
                      return
                    }
                    try {
                      if (remember) localStorage.setItem(EMAIL_KEY, email)
                      else localStorage.removeItem(EMAIL_KEY)
                    } catch {
                      /* storage can be blocked */
                    }
                    router.replace(destination)
                  }}
                >
                  <label className="block text-xs font-medium text-slate-500">
                    Email
                    <input
                      name="email"
                      type="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="login-input mt-1.5"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-500">
                    Password
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="login-input mt-1.5"
                    />
                  </label>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button type="button" className="text-sm font-medium text-[#7B61FF] hover:text-[#684cf0]" onClick={() => setForgot(true)}>
                      Forgot password?
                    </button>
                    <label className="inline-flex items-center gap-2 text-[13px] text-slate-600">
                      <span className="whitespace-nowrap">Remember sign in details</span>
                      <button
                        type="button"
                        className="login-switch shrink-0"
                        role="switch"
                        aria-checked={remember}
                        aria-label="Remember sign in details"
                        onClick={() => setRemember((value) => !value)}
                      >
                        <span />
                      </button>
                    </label>
                  </div>
                  <p className="min-h-4 text-xs text-rose-600" role="alert">
                    {error}
                  </p>
                  <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-[#7B61FF] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#684cf0]">
                    Log in
                  </button>
                </form>
                <details className="mt-6 text-xs text-slate-500">
                  <summary className="cursor-pointer font-medium text-slate-600">Development accounts</summary>
                  <p className="mt-2">Any password works for a listed account. This is not the school identity provider.</p>
                  <ul className="mt-2 grid gap-1">
                    {accounts.map((account) => (
                      <li key={account.id}>
                        <button type="button" className="text-left text-[#7B61FF] hover:underline" onClick={() => setEmail(account.email)}>
                          {account.name} · {roleLabels[account.role]}
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
