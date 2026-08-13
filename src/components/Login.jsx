import { useState } from 'react'

import {
  signInWithEmailAndPassword,
} from 'firebase/auth'

import {
  Sprout,
  LogIn,
} from 'lucide-react'

import {
  auth,
} from '../firebase/firebase'

function Login() {
  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const handleLogin =
    async () => {
      if (
        !email.trim() ||
        !password
      ) {
        alert(
          'Please enter your email and password.'
        )

        return
      }

      try {
        setLoading(true)

        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )
      } catch (error) {
        console.error(
          'Login failed:',
          error
        )

        alert(
          'Unable to sign in. Please check the email and password.'
        )
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8">

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4EFD9]">
            <Sprout size={32} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Krishi Book
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to your farm ledger
          </p>

        </div>

        <section className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  'Enter'
                ) {
                  handleLogin()
                }
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
            />
          </div>

          <button
            onClick={
              handleLogin
            }
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-50"
          >
            <LogIn size={20} />

            {loading
              ? 'Signing in...'
              : 'Sign In'}
          </button>

        </section>

        <p className="mt-6 text-center text-xs text-gray-400">
          You only need to sign in once on this device.
        </p>

      </main>
    </div>
  )
}

export default Login