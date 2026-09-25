import {
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  List as ListIcon,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

import TransactionSearch from './TransactionSearch'

import {
  getTransactions,
} from '../utils/storage'

import {
  filterTransactions,
  formatCurrency,
  getPeriodDateLabel,
} from '../utils/calculations'

import {
  transactionMatchesSearch,
  getSearchSuggestion,
} from '../utils/transactionSearch'

function Trends({
  period,
  setPeriod,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  onBack,
}) {
  const [trendScreen, setTrendScreen] =
    useState('menu')

  const [activeTab, setActiveTab] =
    useState('expense')

  const [searchQuery, setSearchQuery] =
    useState('')

  const transactions =
    getTransactions()

  const periodLabels = {
    day: 'Today',
    month: 'This Month',
    year: 'This Year',
    custom: 'Custom',
  }

  const handleCustomFromChange =
    (value) => {
      setCustomFrom(value)

      if (
        customTo &&
        value &&
        customTo < value
      ) {
        setCustomTo('')
      }
    }

  const handleCustomToChange =
    (value) => {
      if (
        customFrom &&
        value &&
        value < customFrom
      ) {
        alert(
          'To date cannot be earlier than From date.'
        )

        return
      }

      setCustomTo(value)
    }

  const handleResetCustomDates =
    () => {
      setCustomFrom('')
      setCustomTo('')
    }

  /*
   * Filter first by selected period
   */
  const filteredTransactions =
    period === 'custom'
      ? transactions.filter(
          (transaction) => {
            if (!transaction.date) {
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

  /*
   * Search across BOTH expense
   * and income transactions.
   *
   * This happens before the tabs
   * are applied so the same search
   * remains active when switching
   * between Expense and Income.
   */
  const searchedTransactions =
    filteredTransactions.filter(
      (transaction) =>
        transactionMatchesSearch(
          transaction,
          searchQuery
        )
    )

  /*
   * Now apply the Expense / Income tab
   */
  const visibleTransactions =
    searchedTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          activeTab
      )
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )

  /*
   * Total for the currently visible
   * search results and selected tab.
   */
  const visibleTotal =
    visibleTransactions.reduce(
      (total, transaction) =>
        total +
        Number(
          transaction.amount || 0
        ),
      0
    )

  /*
   * Suggestions use ALL historical
   * transactions, not only the
   * currently selected period.
   */
  const searchSuggestion =
    getSearchSuggestion(
      searchQuery,
      transactions
    )

  const formatDate = (date) => {
    if (!date) {
      return ''
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  /*
   * Trends landing page
   *
   * We can add additional
   * visualisation cards here later.
   */
  if (trendScreen === 'menu') {
    return (
      <div className="min-h-screen bg-[#F7F5EF]">

        <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

          {/* Header */}
          <header className="mb-8 flex items-center gap-3">

            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Trends
              </h1>

              <p className="text-sm text-gray-500">
                Understand how your farm is doing
              </p>

            </div>

          </header>

          {/* Visualisations */}
          <section>

            <p className="mb-3 text-sm font-medium text-gray-600">
              Choose a view
            </p>

            {/* List View */}
            <button
              type="button"
              onClick={() =>
                setTrendScreen('list')
              }
              className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
            >

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8E8F5]">
                <ListIcon size={25} />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-base font-semibold text-gray-900">
                  List View
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  See detailed income and expense records
                </p>

              </div>

              <ArrowRight
                size={19}
                className="shrink-0 text-gray-400"
              />

            </button>

          </section>

          <p className="mt-6 text-center text-xs text-gray-400">
            More visualisations will be added here
          </p>

          <p className="mt-8 pb-4 text-center text-xs text-gray-400">
            Krishi Book · Farm Ledger
          </p>

        </main>

      </div>
    )
  }

  /*
   * List View
   */
  return (
    <div className="min-h-screen bg-[#F7F5EF]">

      <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

        {/* Header */}
        <header className="mb-8 flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              setTrendScreen('menu')
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              List View
            </h1>

            <p className="text-sm text-gray-500">
              Income and expense records
            </p>

          </div>

        </header>

        {/* Period Selector */}
        <section className="mb-4">

          <label
            htmlFor="trendPeriod"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            View
          </label>

          <div className="relative">

            <select
              id="trendPeriod"
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

          {/* Exact dates */}
          <p className="mt-2 px-1 text-sm text-gray-500">
            {getPeriodDateLabel(
              period,
              customFrom,
              customTo
            )}
          </p>

        </section>

        {/* Custom Date Range */}
        {period === 'custom' && (
          <section className="mb-5 w-full min-w-0 overflow-hidden rounded-2xl bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between gap-3">

              <p className="text-sm font-medium text-gray-600">
                Select date range
              </p>

              <button
                type="button"
                onClick={
                  handleResetCustomDates
                }
                className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-gray-500"
              >
                Reset
              </button>

            </div>

            <div className="min-w-0 space-y-4">

              {/* From */}
              <div className="min-w-0">

                <label
                  htmlFor="trendCustomFrom"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  From
                </label>

                <input
                  id="trendCustomFrom"
                  type="date"
                  value={customFrom}
                  max={
                    customTo ||
                    undefined
                  }
                  onChange={(event) =>
                    handleCustomFromChange(
                      event.target.value
                    )
                  }
                  className="block w-full min-w-0 max-w-full rounded-xl border border-gray-200 bg-white px-3 py-4 text-base outline-none"
                />

              </div>

              {/* To */}
              <div className="min-w-0">

                <label
                  htmlFor="trendCustomTo"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  To
                </label>

                <input
                  id="trendCustomTo"
                  type="date"
                  value={customTo}
                  min={
                    customFrom ||
                    undefined
                  }
                  onChange={(event) =>
                    handleCustomToChange(
                      event.target.value
                    )
                  }
                  className="block w-full min-w-0 max-w-full rounded-xl border border-gray-200 bg-white px-3 py-4 text-base outline-none"
                />

              </div>

            </div>

          </section>
        )}

        {/* Search */}
        <TransactionSearch
          query={searchQuery}
          onChange={setSearchQuery}
          suggestion={searchSuggestion}
        />

        {/* Expense / Income Tabs */}
        <section className="mb-5 rounded-2xl bg-white p-1.5 shadow-sm">

          <div className="grid grid-cols-2 gap-1">

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  'expense'
                )
              }
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === 'expense'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500'
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  'income'
                )
              }
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === 'income'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500'
              }`}
            >
              Income
            </button>

          </div>

        </section>

        {/* List Summary */}
        <section className="mb-4">

          <div className="flex items-end justify-between gap-3">

            <div>

              <p className="text-lg font-semibold text-gray-900">
                {activeTab === 'expense'
                  ? 'Expenses'
                  : 'Income'}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {
                  visibleTransactions.length
                }{' '}
                record
                {visibleTransactions.length === 1
                  ? ''
                  : 's'}
                {' · '}
                {
                  periodLabels[
                    period
                  ]
                }
              </p>

            </div>

            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(
                visibleTotal
              )}
            </p>

          </div>

        </section>

        {/* Transactions */}
        {visibleTransactions.length === 0 ? (
          <section className="rounded-2xl bg-white p-7 text-center shadow-sm">

            <p className="text-sm font-medium text-gray-700">

              {searchQuery
                ? 'No matching records found'
                : activeTab === 'expense'
                  ? 'No expenses found'
                  : 'No income found'}

            </p>

            <p className="mt-1 text-sm text-gray-400">

              {searchQuery
                ? 'Try another word or check the suggested spelling.'
                : 'There are no records for this period.'}

            </p>

          </section>
        ) : (
          <section className="space-y-3">

            {visibleTransactions.map(
              (transaction) => {

                const isIncome =
                  transaction.type ===
                  'income'

                const isLabour =
  !isIncome &&
  (
    transaction.category ===
      'Labour' ||
    transaction.category ===
      'Manual Labour'
  )
                const hasSaleDetails =
                  isIncome &&
                  transaction.quantity !=
                    null &&
                  transaction.rate !=
                    null

                const hasNewLabourDetails =
                  isLabour &&
                  (
                    transaction.menCount !=
                      null ||
                    transaction.womenCount !=
                      null
                  )

                const hasLegacyLabourDetails =
                  isLabour &&
                  !hasNewLabourDetails &&
                  transaction.numberOfPeople !=
                    null &&
                  transaction.dailyCharge !=
                    null

                const menCount =
                  Number(
                    transaction.menCount ||
                      0
                  )

                const menRate =
                  Number(
                    transaction.menDailyCharge ||
                      0
                  )

                const womenCount =
                  Number(
                    transaction.womenCount ||
                      0
                  )

                const womenRate =
                  Number(
                    transaction.womenDailyCharge ||
                      0
                  )

                const menTotal =
                  menCount * menRate

                const womenTotal =
                  womenCount *
                  womenRate

                return (
                  <div
                    key={
                      transaction.id
                    }
                    className="rounded-2xl bg-white p-4 shadow-sm"
                  >

                    {/* Main transaction row */}
                    <div className="flex items-start gap-3">

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isIncome
                            ? 'bg-[#E4F1E7]'
                            : 'bg-[#FCE8E4]'
                        }`}
                      >

                        {isIncome ? (
                          <TrendingUp
                            size={21}
                          />
                        ) : (
                          <TrendingDown
                            size={21}
                          />
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="font-medium text-gray-900">

                          {isIncome
                            ? transaction.crop
                            : transaction.expenseType}

                        </p>

                        <p className="mt-1 text-xs text-gray-500">

                          {isIncome
                            ? transaction.incomeType
                            : transaction.category}

                          {' · '}

                          {formatDate(
                            transaction.date
                          )}

                        </p>

                      </div>

                      <p
                        className={`shrink-0 font-semibold ${
                          isIncome
                            ? 'text-gray-900'
                            : 'text-gray-700'
                        }`}
                      >

                        {isIncome
                          ? '+'
                          : '-'}

                        {formatCurrency(
                          transaction.amount
                        )}

                      </p>

                    </div>

                    {/* Income sale details */}
                    {hasSaleDetails && (
                      <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                        <p className="text-xs font-medium text-gray-500">
                          Sale details
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">

                          {Number(
                            transaction.quantity
                          ).toLocaleString(
                            'en-IN'
                          )}{' '}

                          {transaction.crop ===
                          'Coconut'
                            ? 'coconuts'
                            : 'kg'}

                          {' × '}

                          {formatCurrency(
                            transaction.rate
                          )}

                          {transaction.crop ===
                          'Coconut'
                            ? ' / coconut'
                            : ' / kg'}

                        </p>

                      </div>
                    )}

                    {/* New Manual Labour details */}
                    {hasNewLabourDetails && (
                      <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                        <p className="mb-2 text-xs font-medium text-gray-500">
                          Labour details
                        </p>

                        {menCount > 0 && (
                          <div className="mb-2 flex items-center justify-between gap-3">

                            <span className="text-sm text-gray-700">
                              Men
                            </span>

                            <span className="text-right text-sm font-medium text-gray-900">

                              {menCount}

                              {' × '}

                              {formatCurrency(
                                menRate
                              )}

                              {' = '}

                              {formatCurrency(
                                menTotal
                              )}

                            </span>

                          </div>
                        )}

                        {womenCount > 0 && (
                          <div className="flex items-center justify-between gap-3">

                            <span className="text-sm text-gray-700">
                              Women
                            </span>

                            <span className="text-right text-sm font-medium text-gray-900">

                              {womenCount}

                              {' × '}

                              {formatCurrency(
                                womenRate
                              )}

                              {' = '}

                              {formatCurrency(
                                womenTotal
                              )}

                            </span>

                          </div>
                        )}

                      </div>
                    )}

                    {/* Older Manual Labour records */}
                    {hasLegacyLabourDetails && (
                      <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                        <p className="mb-1 text-xs font-medium text-gray-500">
                          Labour details
                        </p>

                        <p className="text-sm font-medium text-gray-700">

                          {
                            transaction.numberOfPeople
                          }{' '}

                          people

                          {' × '}

                          {formatCurrency(
                            transaction.dailyCharge
                          )}

                          {' = '}

                          {formatCurrency(
                            Number(
                              transaction.numberOfPeople
                            ) *
                              Number(
                                transaction.dailyCharge
                              )
                          )}

                        </p>

                      </div>
                    )}

                    {/* Notes */}
                    {transaction.notes?.trim() && (
                      <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                        <p className="mb-1 text-xs font-medium text-gray-500">
                          Note
                        </p>

                        <p className="text-sm leading-5 text-gray-700">
                          {
                            transaction.notes
                          }
                        </p>

                      </div>
                    )}

                  </div>
                )
              }
            )}

          </section>
        )}

        <p className="mt-8 pb-4 text-center text-xs text-gray-400">
          Krishi Book · Farm Ledger
        </p>

      </main>

    </div>
  )
}

export default Trends