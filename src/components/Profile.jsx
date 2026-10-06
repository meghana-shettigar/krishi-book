import {
  useState,
} from 'react'

import {
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth'

import {
  ArrowLeft,
  Check,
  KeyRound,
  Languages,
  LogOut,
  MapPin,
  UserRound,
} from 'lucide-react'

import {
  auth,
} from '../firebase/firebase'

import {
  clearFarmDeviceCache,
} from '../utils/deviceCache'

import {
  saveLanguage,
} from '../utils/profileStorage'

import {
  useLanguage,
} from '../i18n/LanguageContext'

import FarmLocationSetup from './FarmLocationSetup'

function Profile({
  user,
  profile,
  onBack,
  onProfileChanged,
}) {
  const {
    language,
    setLanguage,
    t,
  } =
    useLanguage()

  const [
    changingLocation,
    setChangingLocation,
  ] =
    useState(false)

  const [
    sendingReset,
    setSendingReset,
  ] =
    useState(false)

  const [
    savingLanguage,
    setSavingLanguage,
  ] =
    useState(false)

  if (
    changingLocation
  ) {
    return (
      <FarmLocationSetup
        title={
          t(
            'Change farm location'
          )
        }
        onCancel={() =>
          setChangingLocation(
            false
          )
        }
        onSaved={(
          updatedProfile
        ) => {
          onProfileChanged?.(
            updatedProfile
          )

          setChangingLocation(
            false
          )
        }}
      />
    )
  }

  const handleLanguageChange =
    async (
      nextLanguage
    ) => {
      if (
        nextLanguage ===
        language
      ) {
        return
      }

      try {
        setSavingLanguage(
          true
        )

        const updatedProfile =
          await saveLanguage(
            nextLanguage
          )

        setLanguage(
          nextLanguage
        )

        onProfileChanged?.(
          updatedProfile
        )
      } catch (error) {
        console.error(
          'Unable to change language:',
          error
        )

        alert(
          t(
            'Unable to change language. Please try again.'
          )
        )
      } finally {
        setSavingLanguage(
          false
        )
      }
    }

  const handlePasswordReset =
    async () => {
      if (
        !user?.email
      ) {
        return
      }

      try {
        setSendingReset(
          true
        )

        await sendPasswordResetEmail(
          auth,
          user.email
        )

        alert(
          t(
            'Password reset email sent. Please check your email.'
          )
        )
      } catch (error) {
        console.error(
          'Unable to send password reset:',
          error
        )

        alert(
          t(
            'Unable to send the reset email. Please try again.'
          )
        )
      } finally {
        setSendingReset(
          false
        )
      }
    }

  const handleLogout =
    async () => {
      const confirmed =
        window.confirm(
          t(
            'Log out of Krishi Book on this phone?'
          )
        )

      if (
        !confirmed
      ) {
        return
      }

      try {
        clearFarmDeviceCache()

        await signOut(
          auth
        )
      } catch (error) {
        console.error(
          'Logout failed:',
          error
        )

        alert(
          t(
            'Unable to log out. Please try again.'
          )
        )
      }
    }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">

      <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

        <header className="mb-7 flex items-center gap-3">

          <button
            type="button"
            onClick={
              onBack
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft
              size={
                20
              }
            />
          </button>

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              {t(
                'Profile'
              )}
            </h1>

            <p className="text-sm text-gray-500">
              {t(
                'Your Krishi Book settings'
              )}
            </p>

          </div>

        </header>

        <section className="mb-4 rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E4EFD9]">
              <UserRound
                size={
                  24
                }
              />
            </div>

            <div className="min-w-0">

              <p className="truncate text-base font-semibold text-gray-900">
                {profile
                  ?.name ||
                  t(
                    'Krishi Book User'
                  )}
              </p>

              <p className="mt-1 truncate text-sm text-gray-500">
                {
                  user?.email
                }
              </p>

            </div>

          </div>

        </section>

        <section className="mb-4 rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <MapPin
              size={
                21
              }
              className="mt-0.5 shrink-0 text-gray-500"
            />

            <div className="min-w-0 flex-1">

              <p className="font-semibold text-gray-900">
                {t(
                  'Farm location'
                )}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {profile
                  ?.farmLocation
                  ?.placeName ||
                  t(
                    'Not set'
                  )}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setChangingLocation(
                true
              )
            }
            className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
          >
            {t(
              'Change Location'
            )}
          </button>

        </section>

        <section className="mb-4 rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-3">

            <Languages
              size={
                21
              }
              className="text-gray-500"
            />

            <p className="font-semibold text-gray-900">
              {t(
                'Language'
              )}
            </p>

          </div>

          <button
            type="button"
            disabled={
              savingLanguage
            }
            onClick={() =>
              handleLanguageChange(
                'en'
              )
            }
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 ${
              language ===
              'en'
                ? 'bg-[#F7F5EF]'
                : 'bg-white'
            }`}
          >

            <span className="text-sm font-medium text-gray-800">
              {t(
                'English'
              )}
            </span>

            {language ===
              'en' && (
              <div className="flex items-center gap-1 text-sm font-semibold text-[#4D7650]">

                <Check
                  size={
                    17
                  }
                />

                {t(
                  'Current'
                )}

              </div>
            )}

          </button>

          <button
            type="button"
            disabled={
              savingLanguage
            }
            onClick={() =>
              handleLanguageChange(
                'kn'
              )
            }
            className={`mt-2 flex w-full items-center justify-between rounded-xl px-4 py-3 ${
              language ===
              'kn'
                ? 'bg-[#F7F5EF]'
                : 'bg-white'
            }`}
          >

            <span className="text-sm font-medium text-gray-800">
              ಕನ್ನಡ
            </span>

            {language ===
              'kn' && (
              <div className="flex items-center gap-1 text-sm font-semibold text-[#4D7650]">

                <Check
                  size={
                    17
                  }
                />

                {t(
                  'Current'
                )}

              </div>
            )}

          </button>

        </section>

        <section className="mb-4 rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <KeyRound
              size={
                21
              }
              className="text-gray-500"
            />

            <div className="flex-1">

              <p className="font-semibold text-gray-900">
                {t(
                  'Password'
                )}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {t(
                  'We will email you a secure link to change it.'
                )}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              handlePasswordReset
            }
            disabled={
              sendingReset
            }
            className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 disabled:opacity-50"
          >
            {sendingReset
              ? t(
                  'Sending...'
                )
              : t(
                  'Change Password'
                )}
          </button>

        </section>

        <button
          type="button"
          onClick={
            handleLogout
          }
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-base font-semibold text-red-600 shadow-sm"
        >

          <LogOut
            size={
              20
            }
          />

          {t(
            'Log Out'
          )}

        </button>

        <p className="mt-8 pb-4 text-center text-xs text-gray-400">
          {t(
            'Krishi Book · Profile'
          )}
        </p>

      </main>

    </div>
  )
}

export default Profile