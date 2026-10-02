import {
  useState,
} from 'react'

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth'

import {
  ArrowLeft,
  KeyRound,
  LogIn,
  Mail,
  Sprout,
  UserPlus,
} from 'lucide-react'

import {
  auth,
} from '../firebase/firebase'

import {
  ensureUserProfile,
} from '../utils/profileStorage'

function getFriendlyAuthError(
  error
) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.'

    case 'auth/invalid-email':
      return 'Please enter a valid email address.'

    case 'auth/weak-password':
      return 'Please choose a password with at least 6 characters.'

    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'The email or password is incorrect.'

    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a little and try again.'

    default:
      return 'Something went wrong. Please try again.'
  }
}

function Login() {
  const [
    mode,
    setMode,
  ] = useState(
    'signin'
  )

  const [
    name,
    setName,
  ] = useState('')

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const resetFormMessages =
    () => {
      setError('')
    }

  const handleLogin =
    async () => {
      if (
        !email.trim() ||
        !password
      ) {
        setError(
          'Please enter your email and password.'
        )

        return
      }

      try {
        setLoading(true)
        setError('')

        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )
      } catch (loginError) {
        console.error(
          'Login failed:',
          loginError
        )

        setError(
          getFriendlyAuthError(
            loginError
          )
        )
      } finally {
        setLoading(false)
      }
    }

  const handleCreateAccount =
    async () => {
      if (!name.trim()) {
        setError(
          'Please enter your name.'
        )

        return
      }

      if (!email.trim()) {
        setError(
          'Please enter your email.'
        )

        return
      }

      if (
        password.length < 6
      ) {
        setError(
          'Please choose a password with at least 6 characters.'
        )

        return
      }

      if (
        password !==
        confirmPassword
      ) {
        setError(
          'The two passwords do not match.'
        )

        return
      }

      try {
        setLoading(true)
        setError('')

        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          )

        await ensureUserProfile(
          credential.user,
          {
            name:
              name.trim(),
          }
        )

        /*
         * Firebase signs the new user
         * in automatically.
         *
         * App.jsx will now show the
         * farm-location setup.
         */
      } catch (createError) {
        console.error(
          'Account creation failed:',
          createError
        )

        setError(
          getFriendlyAuthError(
            createError
          )
        )
      } finally {
        setLoading(false)
      }
    }

  const handlePasswordReset =
    async () => {
      if (!email.trim()) {
        setError(
          'Please enter your email address.'
        )

        return
      }

      try {
        setLoading(true)
        setError('')

        await sendPasswordResetEmail(
          auth,
          email.trim()
        )

        alert(
          'Password reset email sent. Please check your email.'
        )

        setMode(
          'signin'
        )
      } catch (resetError) {
        console.error(
          'Password reset failed:',
          resetError
        )

        setError(
          getFriendlyAuthError(
            resetError
          )
        )
      } finally {
        setLoading(false)
      }
    }

  /*
   * Password reset screen
   */
  if (
    mode === 'reset'
  ) {
    return (
      <div className="min-h-screen bg-[#F7F5EF]">

        <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8">

          <button
            type="button"
            onClick={() => {
              resetFormMessages()
              setMode(
                'signin'
              )
            }}
            className="mb-6 flex w-fit items-center gap-2 text-sm font-semibold text-gray-600"
          >
            <ArrowLeft
              size={18}
            />

            Back
          </button>

          <div className="mb-7 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4EFD9]">

              <KeyRound
                size={30}
              />

            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Forgot password?
            </h1>

            <p className="mt-2 text-sm leading-5 text-gray-500">
              Enter your email and we will send you a link to choose a new password.
            </p>

          </div>

          <section className="rounded-2xl bg-white p-5 shadow-sm">

            <label
              htmlFor="resetEmail"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Email
            </label>

            <input
              id="resetEmail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-4 text-base outline-none"
            />

            {error && (
              <p className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={
                handlePasswordReset
              }
              disabled={
                loading
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-50"
            >
              <Mail
                size={20}
              />

              {loading
                ? 'Sending...'
                : 'Send Reset Email'}
            </button>

          </section>

        </main>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">

      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8">

        <div className="mb-7 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4EFD9]">

            <Sprout
              size={32}
            />

          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Krishi Book
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your simple farm companion
          </p>

        </div>

        {/* Sign in / Create account */}
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-white p-1.5 shadow-sm">

          <button
            type="button"
            onClick={() => {
              setError('')
              setMode(
                'signin'
              )
            }}
            className={`rounded-xl px-3 py-3 text-sm font-semibold ${
              mode ===
              'signin'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setError('')
              setMode(
                'create'
              )
            }}
            className={`rounded-xl px-3 py-3 text-sm font-semibold ${
              mode ===
              'create'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500'
            }`}
          >
            Create Account
          </button>

        </div>

        <section className="rounded-2xl bg-white p-5 shadow-sm">

          {mode ===
            'create' && (
            <div className="mb-4">

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Your name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                value={
                  name
                }
                onChange={(event) =>
                  setName(
                    event
                      .target
                      .value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-4 text-base outline-none"
              />

            </div>
          )}

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
              value={
                email
              }
              onChange={(event) =>
                setEmail(
                  event
                    .target
                    .value
                )
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-4 text-base outline-none"
            />

          </div>

          <div
            className={
              mode ===
              'create'
                ? 'mb-4'
                : 'mb-2'
            }
          >

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={
                mode ===
                'create'
                  ? 'new-password'
                  : 'current-password'
              }
              value={
                password
              }
              onChange={(event) =>
                setPassword(
                  event
                    .target
                    .value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                    'Enter' &&
                  mode ===
                    'signin'
                ) {
                  handleLogin()
                }
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-4 text-base outline-none"
            />

            {mode ===
              'create' && (
              <p className="mt-1 text-xs text-gray-400">
                At least 6 characters
              </p>
            )}

          </div>

          {mode ===
            'create' && (
            <div className="mb-4">

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event
                      .target
                      .value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-4 text-base outline-none"
              />

            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl bg-[#FCF2F0] p-3">

              <p className="text-sm text-red-700">
                {error}
              </p>

            </div>
          )}

          {mode ===
          'signin' ? (
            <>
              <button
                type="button"
                onClick={
                  handleLogin
                }
                disabled={
                  loading
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-50"
              >

                <LogIn
                  size={20}
                />

                {loading
                  ? 'Signing in...'
                  : 'Sign In'}

              </button>

              <button
                type="button"
                onClick={() => {
                  setError('')
                  setMode(
                    'reset'
                  )
                }}
                className="mt-3 w-full px-4 py-3 text-sm font-semibold text-gray-500"
              >
                Forgot password?
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={
                handleCreateAccount
              }
              disabled={
                loading
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-50"
            >

              <UserPlus
                size={20}
              />

              {loading
                ? 'Creating account...'
                : 'Create Account'}

            </button>
          )}

        </section>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          Krishi Book keeps you signed in on this phone until you log out.
        </p>

      </main>

    </div>
  )
}

export default Login