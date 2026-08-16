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

import {
  auth,
} from './firebase/firebase'

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
} from './utils/calculations'

import {
  Plus,
  Wallet,
  BarChart3,
  ChevronDown,
  ArrowRight,
  Sprout,
  CloudUpload,
} from 'lucide-react'

function App() {
  const [period, setPeriod] =
    useState('year')

  const [customFrom, setCustomFrom] =
  useState('')

  const [customTo, setCustomTo] =
  useState('')

  const [screen, setScreen] =
    useState('home')

  const [
    editingTransaction,
    setEditingTransaction,
  ] = useState(null)

  const [user, setUser] =
    useState(null)

  const [authLoading, setAuthLoading] =
    useState(true)

  const [
    dataVersion,
    setDataVersion,
  ] = useState(0)

  const [
    needsMigration,
    setNeedsMigration,
  ] = useState(false)

  const [
    migrationLoading,
    setMigrationLoading,
  ] = useState(false)

  /*
   * Watch Firebase login state.
   */
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(firebaseUser)

          setAuthLoading(false)
        }
      )

    return unsubscribe
  }, [])

  /*
   * Once signed in:
   *
   * 1. Check whether old Local Storage
   *    needs moving to Firebase.
   *
   * 2. Load cloud transactions.
   *
   * 3. Start realtime synchronization.
   */
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
              (version) =>
                version + 1
            )
          }

          unsubscribeCloud =
            subscribeToCloudTransactions(
              () => {
                setDataVersion(
                  (version) =>
                    version + 1
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
  }, [user])

  const handleMigration =
    async () => {
      const confirmed =
        window.confirm(
          'Move the existing records on this device to Krishi Book Cloud?\n\nNothing will be deleted from this device.'
        )

      if (!confirmed) {
        return
      }

      try {
        setMigrationLoading(
          true
        )

        const count =
          await migrateLocalToCloud()

        setNeedsMigration(false)

        await loadCloudTransactions()

        setDataVersion(
          (version) =>
            version + 1
        )

        alert(
          `${count} transaction${
            count === 1
              ? ''
              : 's'
          } moved to Krishi Book Cloud successfully.`
        )
      } catch (error) {
        console.error(
          'Migration failed:',
          error
        )

        alert(
          'Unable to move your records to the cloud. Please try again.'
        )
      } finally {
        setMigrationLoading(
          false
        )
      }
    }

  /*
   * Reading this variable makes React
   * re-render whenever dataVersion
   * changes after a cloud update.
   */
  void dataVersion

  const transactions =
    getTransactions()

 const filteredTransactions =
  period === 'custom'
    ? transactions.filter(
        (transaction) => {
          if (!transaction.date) {
            return false
          }

          if (
            customFrom &&
            transaction.date < customFrom
          ) {
            return false
          }

          if (
            customTo &&
            transaction.date > customTo
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
  day: 'Today',
  month: 'This Month',
  year: 'This Year',
  custom: 'Custom',
}

  const handleComingSoon =
    (feature) => {
      alert(
        `${feature} will be added next.`
      )
    }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <p className="text-sm text-gray-500">
          Opening Krishi Book...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  if (screen === 'expense') {
    return (
      <Expense
        existingTransaction={
          editingTransaction
        }
        onBack={() => {
          setEditingTransaction(null)
          setScreen('home')
        }}
      />
    )
  }

  if (screen === 'details') {
    return (
      <Details
        period={period}
        customFrom={customFrom}
        customTo={customTo}
        onBack={() =>
          setScreen('home')
        }
        onEdit={(transaction) => {
          setEditingTransaction(
            transaction
          )

          if (
            transaction.type ===
            'income'
          ) {
            setScreen('income')
          } else {
            setScreen('expense')
          }
        }}
      />
    )
  }

  if (screen === 'income') {
    return (
      <Income
        existingTransaction={
          editingTransaction
        }
        onBack={() => {
          setEditingTransaction(null)
          setScreen('home')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E4EFD9]">
              <Sprout size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Krishi Book
              </h1>

              <p className="text-sm text-gray-500">
                Your farm ledger
              </p>
            </div>

          </div>
        </header>

        {/* Migration */}
        {needsMigration && (
          <section className="mb-6 rounded-2xl border border-[#D6E6C7] bg-[#EDF5E7] p-5">

            <div className="flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                <CloudUpload
                  size={21}
                />
              </div>

              <div className="flex-1">

                <p className="font-semibold text-gray-900">
                  Move existing records to cloud
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Your existing farm records are still stored on this device. Move them to Krishi Book Cloud so they can appear on your other phones too.
                </p>

                <button
                  onClick={
                    handleMigration
                  }
                  disabled={
                    migrationLoading
                  }
                  className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {migrationLoading
                    ? 'Moving records...'
                    : 'Move My Records'}
                </button>

              </div>

            </div>

          </section>
        )}

        {/* Period Selector */}
        <section className="mb-4">

          <label
            htmlFor="period"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            View
          </label>

          <div className="relative">

            <select
              id="period"
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target.value
                )
              }
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
            >
              <option value="day">
                Today
              </option>

              <option value="month">
                This Month
              </option>

              <option value="year">
                This Year
              </option>

              <option value="custom">
              Custom
              </option>

            </select>

            <ChevronDown
              size={20}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

          </div>

        </section>
{/* Custom Date Range */}
{period === 'custom' && (
  <section className="mb-4 rounded-2xl bg-white p-5 shadow-sm">

    <p className="mb-4 text-sm font-medium text-gray-600">
      Select date range
    </p>

    <div className="space-y-4">

      {/* From */}
      <div>
        <label
          htmlFor="customFrom"
          className="mb-2 block text-sm font-medium text-gray-600"
        >
          From
        </label>

        <input
          id="customFrom"
          type="date"
          value={customFrom}
          max={customTo || undefined}
          onChange={(event) =>
            setCustomFrom(
              event.target.value
            )
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
        />
      </div>

      {/* To */}
      <div>
        <label
          htmlFor="customTo"
          className="mb-2 block text-sm font-medium text-gray-600"
        >
          To
        </label>

        <input
          id="customTo"
          type="date"
          value={customTo}
          min={customFrom || undefined}
          onChange={(event) =>
            setCustomTo(
              event.target.value
            )
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
        />
      </div>

    </div>

  </section>
)}
        {/* Profit / Loss */}
        <section className="mb-3 rounded-2xl bg-white p-6 shadow-sm">

          <p className="text-center text-sm font-medium uppercase tracking-wide text-gray-500">
            {
              periodLabels[
                period
              ]
            }{' '}
            Profit / Loss
          </p>

          <p
            className={`mt-3 text-center text-4xl font-bold ${
              totals.profitLoss < 0
                ? 'text-red-600'
                : 'text-gray-900'
            }`}
          >
            {formatCurrency(
              totals.profitLoss
            )}
          </p>

          <p className="mt-2 text-center text-sm text-gray-500">
            Income:{' '}
            {formatCurrency(
              totals.income
            )}
            {' · '}
            Expenses:{' '}
            {formatCurrency(
              totals.expenses
            )}
          </p>

        </section>

        {/* View Details */}
        <button
          onClick={() =>
            setScreen('details')
          }
          className="mb-6 flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-700"
        >
          View Details

          <ArrowRight size={17} />
        </button>

        {/* Main Actions */}
        <div className="space-y-3">

          <button
            onClick={() =>
              setScreen('expense')
            }
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FCE8E4]">
              <Plus size={25} />
            </div>

            <div>
              <p className="text-base font-semibold text-gray-900">
                Record Expense
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add money spent on the farm
              </p>
            </div>

          </button>

          <button
            onClick={() =>
              setScreen('income')
            }
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4F1E7]">
              <Wallet size={25} />
            </div>

            <div>
              <p className="text-base font-semibold text-gray-900">
                Record Income
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add money made from the farm
              </p>
            </div>

          </button>

          <button
            onClick={() =>
              handleComingSoon(
                'Trends'
              )
            }
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8E8F5]">
              <BarChart3 size={25} />
            </div>

            <div>
              <p className="text-base font-semibold text-gray-900">
                Trends
              </p>

              <p className="mt-1 text-sm text-gray-500">
                See how your farm is doing
              </p>
            </div>

          </button>

        </div>

        {/* Cloud status */}
        <p className="mt-8 text-center text-xs text-gray-400">
          ☁ Synced with Krishi Book Cloud
        </p>

        {/* Footer */}
        <p className="mt-3 pb-4 text-center text-xs text-gray-400">
          Krishi Book · Farm Ledger
        </p>

      </main>
    </div>
  )
}

export default App