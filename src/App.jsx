import {
  useEffect,
  useState,
} from 'react'

import {
  onAuthStateChanged,
} from 'firebase/auth'

import Expense from './components/Expense'
import Details from './components/Details'
import Income from './components/Income'
import Login from './components/Login'
import Trends from './components/Trends'
import Contacts from './components/Contacts'
import WeatherBar from './components/WeatherBar'
import FarmWeather from './components/FarmWeather'
import FarmLocationSetup from './components/FarmLocationSetup'
import Profile from './components/Profile'

import {
  auth,
} from './firebase/firebase'

import {
  ensureUserProfile,
} from './utils/profileStorage'

import {
  prepareDeviceForUser,
} from './utils/deviceCache'

import {
  getTransactions,
  getCloudStatus,
  loadCloudTransactions,
  migrateLocalToCloud,
  subscribeToCloudTransactions,
} from './utils/storage'

import {
  filterTransactions,
  calculateTotals,
  formatCurrency,
  getPeriodDateLabel,
} from './utils/calculations'

import {
  useLanguage,
} from './i18n/LanguageContext'

import {
  Plus,
  Wallet,
  BarChart3,
  ChevronDown,
  ArrowRight,
  Sprout,
  CloudUpload,
  Phone,
  User,
} from 'lucide-react'

function App() {
  const {
    language,
    setLanguage,
    t,
  } =
    useLanguage()

  const [
    period,
    setPeriod,
  ] =
    useState(
      'year'
    )

  const [
    customFrom,
    setCustomFrom,
  ] =
    useState('')

  const [
    customTo,
    setCustomTo,
  ] =
    useState('')

  const [
    screen,
    setScreen,
  ] =
    useState(
      'home'
    )

  const [
    editingTransaction,
    setEditingTransaction,
  ] =
    useState(null)

  const [
    user,
    setUser,
  ] =
    useState(null)

  const [
    profile,
    setProfile,
  ] =
    useState(null)

  const [
    profileLoading,
    setProfileLoading,
  ] =
    useState(true)

  const [
    authLoading,
    setAuthLoading,
  ] =
    useState(true)

  const [
    dataVersion,
    setDataVersion,
  ] =
    useState(0)

  const [
    needsMigration,
    setNeedsMigration,
  ] =
    useState(false)

  const [
    migrationLoading,
    setMigrationLoading,
  ] =
    useState(false)

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (
          firebaseUser
        ) => {
          if (
            firebaseUser
          ) {
            prepareDeviceForUser(
              firebaseUser.uid
            )
          }

          setUser(
            firebaseUser
          )

          if (
            !firebaseUser
          ) {
            setProfile(
              null
            )

            setProfileLoading(
              false
            )
          }

          setAuthLoading(
            false
          )
        }
      )

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    let cancelled =
      false

    const loadProfile =
      async () => {
        try {
          setProfileLoading(
            true
          )

          const userProfile =
            await ensureUserProfile(
              user
            )

          if (
            !cancelled
          ) {
            /*
             * Account preference
             * wins over the local
             * device preference.
             */
            setLanguage(
              userProfile
                ?.language ||
              'en'
            )

            setProfile(
              userProfile
            )
          }
        } catch (error) {
          console.error(
            'Unable to load user profile:',
            error
          )
        } finally {
          if (
            !cancelled
          ) {
            setProfileLoading(
              false
            )
          }
        }
      }

    loadProfile()

    return () => {
      cancelled =
        true
    }
  }, [
    user,
    setLanguage,
  ])

  useEffect(() => {
    if (!user) {
      return
    }

    let unsubscribeCloud =
      () => {}

    const startCloud =
      async () => {
        try {
          const status =
            await getCloudStatus()

          setNeedsMigration(
            status.needsMigration
          )

          if (
            !status.needsMigration
          ) {
            await loadCloudTransactions()

            setDataVersion(
              (
                version
              ) =>
                version +
                1
            )
          }

          unsubscribeCloud =
            subscribeToCloudTransactions(
              () => {
                setDataVersion(
                  (
                    version
                  ) =>
                    version +
                    1
                )
              }
            )
        } catch (error) {
          console.error(
            'Unable to start cloud sync:',
            error
          )
        }
      }

    startCloud()

    return () => {
      unsubscribeCloud()
    }
  }, [
    user,
  ])

  const handleMigration =
    async () => {
      const confirmed =
        window.confirm(
          t(
            'Move the existing records on this device to Krishi Book Cloud?\n\nNothing will be deleted from this device.'
          )
        )

      if (
        !confirmed
      ) {
        return
      }

      try {
        setMigrationLoading(
          true
        )

        const count =
          await migrateLocalToCloud()

        setNeedsMigration(
          false
        )

        await loadCloudTransactions()

        setDataVersion(
          (
            version
          ) =>
            version +
            1
        )

        alert(
          t(
            '{count} records moved to Krishi Book Cloud successfully.',
            {
              count,
            }
          )
        )
      } catch (error) {
        console.error(
          'Migration failed:',
          error
        )

        alert(
          t(
            'Unable to move your records to the cloud. Please try again.'
          )
        )
      } finally {
        setMigrationLoading(
          false
        )
      }
    }

  const handleCustomFromChange =
    (
      value
    ) => {
      setCustomFrom(
        value
      )

      if (
        customTo &&
        value &&
        customTo <
          value
      ) {
        setCustomTo(
          ''
        )
      }
    }

  const handleCustomToChange =
    (
      value
    ) => {
      if (
        customFrom &&
        value &&
        value <
          customFrom
      ) {
        alert(
          t(
            'To date cannot be earlier than From date.'
          )
        )

        return
      }

      setCustomTo(
        value
      )
    }

  const handleResetCustomDates =
    () => {
      setCustomFrom('')
      setCustomTo('')
    }

  void dataVersion

  const transactions =
    getTransactions()

  const filteredTransactions =
    period ===
    'custom'
      ? transactions.filter(
          (
            transaction
          ) => {
            if (
              !transaction.date
            ) {
              return false
            }

            if (
              customFrom &&
              transaction.date <
                customFrom
            ) {
              return false
            }

            if (
              customTo &&
              transaction.date >
                customTo
            ) {
              return false
            }

            return true
          }
        )
      : filterTransactions(
          transactions,
          period
        )

  const totals =
    calculateTotals(
      filteredTransactions
    )

  const periodLabels = {
    day:
      t('Today'),

    month:
      t(
        'This Month'
      ),

    year:
      t(
        'This Year'
      ),

    custom:
      t('Custom'),
  }

  if (
    authLoading ||
    (
      user &&
      profileLoading
    )
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">

        <p className="text-sm text-gray-500">
          {t(
            'Opening Krishi Book...'
          )}
        </p>

      </div>
    )
  }

  if (!user) {
    return (
      <Login />
    )
  }

  if (
    !profile
      ?.farmLocation
      ?.confirmed
  ) {
    return (
      <FarmLocationSetup
        showAccountSwitch
        onSaved={(
          updatedProfile
        ) =>
          setProfile(
            updatedProfile
          )
        }
      />
    )
  }

  if (
    screen ===
    'expense'
  ) {
    return (
      <Expense
        existingTransaction={
          editingTransaction
        }
        onBack={() => {
          setEditingTransaction(
            null
          )

          setScreen(
            'home'
          )
        }}
      />
    )
  }

  if (
    screen ===
    'details'
  ) {
    return (
      <Details
        period={
          period
        }
        customFrom={
          customFrom
        }
        customTo={
          customTo
        }
        onBack={() =>
          setScreen(
            'home'
          )
        }
        onEdit={(
          transaction
        ) => {
          setEditingTransaction(
            transaction
          )

          if (
            transaction.type ===
            'income'
          ) {
            setScreen(
              'income'
            )
          } else {
            setScreen(
              'expense'
            )
          }
        }}
      />
    )
  }

  if (
    screen ===
    'income'
  ) {
    return (
      <Income
        existingTransaction={
          editingTransaction
        }
        onBack={() => {
          setEditingTransaction(
            null
          )

          setScreen(
            'home'
          )
        }}
      />
    )
  }

  if (
    screen ===
    'trends'
  ) {
    return (
      <Trends
        period={
          period
        }
        setPeriod={
          setPeriod
        }
        customFrom={
          customFrom
        }
        setCustomFrom={
          setCustomFrom
        }
        customTo={
          customTo
        }
        setCustomTo={
          setCustomTo
        }
        onBack={() =>
          setScreen(
            'home'
          )
        }
      />
    )
  }

  if (
    screen ===
    'contacts'
  ) {
    return (
      <Contacts
        onBack={() =>
          setScreen(
            'home'
          )
        }
      />
    )
  }

  if (
    screen ===
    'profile'
  ) {
    return (
      <Profile
        user={
          user
        }
        profile={
          profile
        }
        onBack={() =>
          setScreen(
            'home'
          )
        }
        onProfileChanged={(
          updatedProfile
        ) =>
          setProfile(
            updatedProfile
          )
        }
      />
    )
  }

  if (
    screen ===
    'weather'
  ) {
    return (
      <FarmWeather
        farmLocation={
          profile
            .farmLocation
        }
        onBack={() =>
          setScreen(
            'home'
          )
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">

      <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

        <header className="mb-5">

          <div className="flex items-center justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4EFD9]">

                <Sprout
                  size={
                    24
                  }
                />

              </div>

              <div className="min-w-0">

                <h1 className="text-2xl font-bold text-gray-900">
                  {t(
                    'Krishi Book'
                  )}
                </h1>

                <p className="text-sm text-gray-500">
                  {t(
                    'Your farm ledger'
                  )}
                </p>

              </div>

            </div>

            <div className="flex shrink-0 items-center gap-2">

  {/* Farm Contacts */}
  <button
    type="button"
    onClick={() =>
      setScreen(
        'contacts'
      )
    }
    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition active:scale-[0.96]"
    aria-label={
      t(
        'Farm Contacts'
      )
    }
  >
    <Phone
      size={
        21
      }
    />
  </button>

  {/* Profile */}
  <button
    type="button"
    onClick={() =>
      setScreen(
        'profile'
      )
    }
    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition active:scale-[0.96]"
    aria-label={
      t(
        'Profile'
      )
    }
  >
    <User
      size={
        22
      }
    />
  </button>

</div>

          </div>

        </header>

        <WeatherBar
          farmLocation={
            profile
              .farmLocation
          }
          onOpen={() =>
            setScreen(
              'weather'
            )
          }
        />

        {needsMigration && (
          <section className="mb-6 rounded-2xl border border-[#D6E6C7] bg-[#EDF5E7] p-5">

            <div className="flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                <CloudUpload
                  size={
                    21
                  }
                />
              </div>

              <div className="flex-1">

                <p className="font-semibold text-gray-900">
                  {t(
                    'Move existing records to cloud'
                  )}
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-600">
                  {t(
                    'Your existing farm records are still stored on this device. Move them to Krishi Book Cloud so they can appear on your other phones too.'
                  )}
                </p>

                <button
                  type="button"
                  onClick={
                    handleMigration
                  }
                  disabled={
                    migrationLoading
                  }
                  className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {migrationLoading
                    ? t(
                        'Moving records...'
                      )
                    : t(
                        'Move My Records'
                      )}
                </button>

              </div>

            </div>

          </section>
        )}

        <section className="mb-4">

          <label
            htmlFor="period"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            {t(
              'View'
            )}
          </label>

          <div className="relative">

            <select
              id="period"
              value={
                period
              }
              onChange={(
                event
              ) =>
                setPeriod(
                  event
                    .target
                    .value
                )
              }
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
            >
              <option value="day">
                {t(
                  'Today'
                )}
              </option>

              <option value="month">
                {t(
                  'This Month'
                )}
              </option>

              <option value="year">
                {t(
                  'This Year'
                )}
              </option>

              <option value="custom">
                {t(
                  'Custom'
                )}
              </option>
            </select>

            <ChevronDown
              size={
                20
              }
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

          </div>

          <p className="mt-2 px-1 text-sm text-gray-500">
            {getPeriodDateLabel(
              period,
              customFrom,
              customTo,
              language
            )}
          </p>

        </section>

        {period ===
          'custom' && (
          <section className="mb-4 w-full min-w-0 overflow-hidden rounded-2xl bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between gap-3">

              <p className="text-sm font-medium text-gray-600">
                {t(
                  'Select date range'
                )}
              </p>

              <button
                type="button"
                onClick={
                  handleResetCustomDates
                }
                className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-gray-500"
              >
                {t(
                  'Reset'
                )}
              </button>

            </div>

            <div className="min-w-0 space-y-4">

              <div className="min-w-0">

                <label
                  htmlFor="customFrom"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  {t(
                    'From'
                  )}
                </label>

                <input
                  id="customFrom"
                  lang="en-IN"
                  type="date"
                  value={
                    customFrom
                  }
                  max={
                    customTo ||
                    undefined
                  }
                  onChange={(
                    event
                  ) =>
                    handleCustomFromChange(
                      event
                        .target
                        .value
                    )
                  }
                  className="block w-full min-w-0 max-w-full rounded-xl border border-gray-200 bg-white px-3 py-4 text-base outline-none"
                />

              </div>

              <div className="min-w-0">

                <label
                  htmlFor="customTo"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  {t(
                    'To'
                  )}
                </label>

                <input
                  id="customTo"
                  lang="en-IN"
                  type="date"
                  value={
                    customTo
                  }
                  min={
                    customFrom ||
                    undefined
                  }
                  onChange={(
                    event
                  ) =>
                    handleCustomToChange(
                      event
                        .target
                        .value
                    )
                  }
                  className="block w-full min-w-0 max-w-full rounded-xl border border-gray-200 bg-white px-3 py-4 text-base outline-none"
                />

              </div>

            </div>

          </section>
        )}

        <section className="mb-3 rounded-2xl bg-white p-6 shadow-sm">

          <p className="text-center text-sm font-medium tracking-wide text-gray-500">

            {
              periodLabels[
                period
              ]
            }{' '}

            {t(
              'Profit / Loss'
            )}

          </p>

          <p
            className={`mt-3 text-center text-4xl font-bold ${
              totals
                .profitLoss <
              0
                ? 'text-red-600'
                : 'text-gray-900'
            }`}
          >
            {formatCurrency(
              totals
                .profitLoss
            )}
          </p>

          <p className="mt-2 text-center text-sm text-gray-500">

            {t(
              'Income'
            )}
            :{' '}

            {formatCurrency(
              totals.income
            )}

            {' · '}

            {t(
              'Expenses'
            )}
            :{' '}

            {formatCurrency(
              totals.expenses
            )}

          </p>

        </section>

        <button
          type="button"
          onClick={() =>
            setScreen(
              'details'
            )
          }
          className="mb-6 flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-700"
        >
          {t(
            'View Details'
          )}

          <ArrowRight
            size={
              17
            }
          />
        </button>

        <div className="space-y-3">

          <button
            type="button"
            onClick={() =>
              setScreen(
                'expense'
              )
            }
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FCE8E4]">
              <Plus
                size={
                  25
                }
              />
            </div>

            <div>

              <p className="text-base font-semibold text-gray-900">
                {t(
                  'Record Expense'
                )}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {t(
                  'Add money spent on the farm'
                )}
              </p>

            </div>

          </button>

          <button
            type="button"
            onClick={() =>
              setScreen(
                'income'
              )
            }
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4F1E7]">
              <Wallet
                size={
                  25
                }
              />
            </div>

            <div>

              <p className="text-base font-semibold text-gray-900">
                {t(
                  'Record Income'
                )}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {t(
                  'Add money made from the farm'
                )}
              </p>

            </div>

          </button>

          <button
            type="button"
            onClick={() =>
              setScreen(
                'trends'
              )
            }
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8E8F5]">
              <BarChart3
                size={
                  25
                }
              />
            </div>

            <div>

              <p className="text-base font-semibold text-gray-900">
                {t(
                  'Trends'
                )}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {t(
                  'See how your farm is doing'
                )}
              </p>

            </div>

          </button>

        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          ☁{' '}
          {t(
            'Synced with Krishi Book Cloud'
          )}
        </p>

        <p className="mt-3 pb-4 text-center text-xs text-gray-400">
          {t(
            'Krishi Book · Farm Ledger'
          )}
        </p>

      </main>

    </div>
  )
}

export default App