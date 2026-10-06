import {
  useState,
} from 'react'

import {
  signOut,
} from 'firebase/auth'

import {
  Check,
  LocateFixed,
  MapPin,
  RefreshCw,
} from 'lucide-react'

import {
  auth,
} from '../firebase/firebase'

import {
  clearFarmDeviceCache,
} from '../utils/deviceCache'

import {
  getCurrentDeviceLocation,
  reverseGeocodeFarmLocation,
} from '../utils/farmLocation'

import {
  saveFarmLocation,
} from '../utils/profileStorage'

import {
  useLanguage,
} from '../i18n/LanguageContext'

function FarmLocationSetup({
  onSaved,
  onCancel,
  title = '',
  showAccountSwitch = false,
}) {
  const {
    t,
  } =
    useLanguage()

  const [
    finding,
    setFinding,
  ] =
    useState(false)

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const [
    candidate,
    setCandidate,
  ] =
    useState(null)

  const [
    error,
    setError,
  ] =
    useState('')

  const findLocation =
    async () => {
      try {
        setFinding(
          true
        )

        setError('')
        setCandidate(
          null
        )

        const coordinates =
          await getCurrentDeviceLocation()

        const location =
          await reverseGeocodeFarmLocation(
            coordinates.latitude,
            coordinates.longitude
          )

        setCandidate(
          location
        )
      } catch (findError) {
        console.error(
          'Unable to find farm location:',
          findError
        )

        setError(
          findError.message ||
          'Unable to find your location. Please try again.'
        )
      } finally {
        setFinding(
          false
        )
      }
    }

  const confirmLocation =
    async () => {
      if (
        !candidate
      ) {
        return
      }

      try {
        setSaving(
          true
        )

        setError('')

        const updatedProfile =
          await saveFarmLocation(
            candidate
          )

        onSaved?.(
          updatedProfile
        )
      } catch (saveError) {
        console.error(
          'Unable to save farm location:',
          saveError
        )

        setError(
          'Unable to save your farm location. Please try again.'
        )
      } finally {
        setSaving(
          false
        )
      }
    }

  const handleSwitchAccount =
    async () => {
      const confirmed =
        window.confirm(
          t(
            'Use another Krishi Book account on this phone?'
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
      } catch (switchError) {
        console.error(
          'Unable to switch account:',
          switchError
        )

        alert(
          t(
            'Unable to change account. Please try again.'
          )
        )
      }
    }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">

      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8">

        <div className="mb-7 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4EFD9]">

            <MapPin
              size={
                30
              }
            />

          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            {title ||
              t(
                'Set your farm location'
              )}
          </h1>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-600">
            {t(
              'Please do this while you are at or near your farm.'
            )}
          </p>

        </div>

        {!candidate ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm">

            <p className="text-center text-base font-semibold text-gray-900">
              {t(
                'Find your farm'
              )}
            </p>

            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              {t(
                'Krishi Book will use your phone to find the farm location for weather information.'
              )}
            </p>

            <button
              type="button"
              onClick={
                findLocation
              }
              disabled={
                finding
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-50"
            >

              {finding ? (
                <RefreshCw
                  size={
                    21
                  }
                  className="animate-spin"
                />
              ) : (
                <LocateFixed
                  size={
                    21
                  }
                />
              )}

              {finding
                ? t(
                    'Finding your farm...'
                  )
                : t(
                    'Use My Location'
                  )}

            </button>

            {error && (
              <div className="mt-4 rounded-xl bg-[#FCF2F0] p-4">

                <p className="text-sm leading-5 text-[#8C443B]">
                  {t(
                    error
                  )}
                </p>

              </div>
            )}

            {onCancel && (
              <button
                type="button"
                onClick={
                  onCancel
                }
                className="mt-3 w-full px-4 py-3 text-sm font-semibold text-gray-500"
              >
                {t(
                  'Cancel'
                )}
              </button>
            )}

          </section>
        ) : (
          <section className="rounded-2xl bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              {t(
                'We found:'
              )}
            </p>

            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#F3F7EF] p-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">

                <MapPin
                  size={
                    22
                  }
                />

              </div>

              <p className="text-lg font-semibold text-gray-900">
                {
                  candidate
                    .placeName
                }
              </p>

            </div>

            <p className="mt-5 text-center text-base font-semibold text-gray-900">
              {t(
                'Is this your farm?'
              )}
            </p>

            <button
              type="button"
              onClick={
                confirmLocation
              }
              disabled={
                saving
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-50"
            >

              <Check
                size={
                  21
                }
              />

              {saving
                ? t(
                    'Saving...'
                  )
                : t(
                    'Yes, Save'
                  )}

            </button>

            <button
              type="button"
              onClick={
                findLocation
              }
              disabled={
                finding ||
                saving
              }
              className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-base font-semibold text-gray-700 disabled:opacity-50"
            >
              {t(
                'Try Again'
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={
                  onCancel
                }
                disabled={
                  saving
                }
                className="mt-2 w-full px-4 py-3 text-sm font-semibold text-gray-500"
              >
                {t(
                  'Cancel'
                )}
              </button>
            )}

          </section>
        )}

        {showAccountSwitch && (
          <section className="mt-6 border-t border-gray-200 pt-5">

            <p className="text-center text-xs text-gray-400">
              {t(
                'Signed in as'
              )}
            </p>

            <p className="mt-1 truncate text-center text-sm font-medium text-gray-600">
              {auth
                .currentUser
                ?.email ||
                t(
                  'Krishi Book user'
                )}
            </p>

            <button
              type="button"
              onClick={
                handleSwitchAccount
              }
              className="mt-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-gray-600"
            >
              {t(
                'Use Another Account'
              )}
            </button>

          </section>
        )}

        <p className="mt-5 text-center text-xs text-gray-400">
          {t(
            'Place names provided using OpenStreetMap data'
          )}
        </p>

      </main>

    </div>
  )
}

export default FarmLocationSetup