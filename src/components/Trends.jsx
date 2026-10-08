import {
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
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

import {
  EXPENSE_CATEGORIES,
  mapExpenseToV3,
} from '../data/expenseCategories'

import {
  useLanguage,
} from '../i18n/LanguageContext'


/*
 * Keep Income categories in a
 * predictable order.
 *
 * Stable ordering is easier to learn
 * than sorting by total, because the
 * category does not move every time
 * new data is added.
 */
const INCOME_CATEGORY_ORDER = [
  'Coconut',
  'Supari',
  'Pepper',
  'Vegetable',
  'Agricultural benefit',
  'Other',
]


/*
 * Returns the final category used
 * for grouping a transaction.
 *
 * Expense:
 * uses Category V3.
 *
 * Income:
 * uses crop, which already gives us
 * useful groups such as Coconut,
 * Supari, Pepper, etc.
 */
function getTransactionCategory(
  transaction
) {
  if (
    transaction.type ===
    'expense'
  ) {
    const mapped =
      mapExpenseToV3(
        transaction.category,
        transaction.expenseType
      )

    return (
      mapped?.category ||
      transaction.category ||
      'Other Expense'
    )
  }

  return (
    transaction.crop ||
    transaction.incomeType ||
    'Other'
  )
}


function Trends({
  period,
  setPeriod,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  onBack,
}) {
  const {
    language,
    t,
    valueLabel,
    formatDate,
  } =
    useLanguage()

  /*
   * menu
   *   → Trends landing page
   *
   * list
   *   → Category-based List View
   */
  const [
    trendScreen,
    setTrendScreen,
  ] =
    useState('menu')

  const [
    activeTab,
    setActiveTab,
  ] =
    useState('expense')

  /*
   * null means:
   *
   * show category overview.
   *
   * A category name means:
   *
   * show records inside that category.
   */
  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState(null)

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState('')


  const transactions =
    getTransactions()


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


  /*
   * --------------------------------
   * NAVIGATION HELPERS
   * --------------------------------
   */

  const showCategories =
    () => {
      setSelectedCategory(
        null
      )

      setSearchQuery('')

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }


  const openCategory =
    (
      category
    ) => {
      setSelectedCategory(
        category
      )

      setSearchQuery('')

      /*
       * Important on mobile:
       *
       * If a farmer taps a category
       * near the bottom of the page,
       * bring them back to the top so
       * they immediately see the
       * breadcrumb and category title.
       */
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }


  const handleTabChange =
    (
      nextTab
    ) => {
      setActiveTab(
        nextTab
      )

      setSelectedCategory(
        null
      )

      setSearchQuery('')
    }


  const handlePeriodChange =
    (
      value
    ) => {
      setPeriod(
        value
      )

      /*
       * Changing period can completely
       * change which categories exist.
       * Return to category overview.
       */
      setSelectedCategory(
        null
      )

      setSearchQuery('')
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
        setCustomTo('')
      }

      setSelectedCategory(
        null
      )

      setSearchQuery('')
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

      setSelectedCategory(
        null
      )

      setSearchQuery('')
    }


  const handleResetCustomDates =
    () => {
      setCustomFrom('')
      setCustomTo('')

      setSelectedCategory(
        null
      )

      setSearchQuery('')
    }


  /*
   * --------------------------------
   * PERIOD FILTER
   * --------------------------------
   */

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


  /*
   * Only records belonging to the
   * selected Expense / Income tab.
   */
  const tabTransactions =
    filteredTransactions.filter(
      (
        transaction
      ) =>
        transaction.type ===
        activeTab
    )


  const activeTabTotal =
    tabTransactions.reduce(
      (
        total,
        transaction
      ) =>
        total +
        Number(
          transaction.amount ||
          0
        ),
      0
    )


  /*
   * --------------------------------
   * BUILD CATEGORY SUMMARY
   * --------------------------------
   *
   * Example:
   *
   * Pesticide
   * total: ₹4,800
   * count: 3
   */

  const categoryMap =
    new Map()


  tabTransactions.forEach(
    (
      transaction
    ) => {
      const category =
        getTransactionCategory(
          transaction
        )

      const existing =
        categoryMap.get(
          category
        ) || {
          category,
          total: 0,
          count: 0,
        }

      existing.total +=
        Number(
          transaction.amount ||
          0
        )

      existing.count +=
        1

      categoryMap.set(
        category,
        existing
      )
    }
  )


  /*
   * Keep categories in the same
   * familiar order used elsewhere
   * in Krishi Book.
   */
  const categoryOrder =
    activeTab ===
    'expense'
      ? EXPENSE_CATEGORIES.map(
          (
            item
          ) =>
            item.value
        )
      : INCOME_CATEGORY_ORDER


  const categoryGroups = [
    ...categoryMap.values(),
  ].sort(
    (
      first,
      second
    ) => {
      const firstIndex =
        categoryOrder.indexOf(
          first.category
        )

      const secondIndex =
        categoryOrder.indexOf(
          second.category
        )

      /*
       * Unknown/new categories are
       * placed after the known ones.
       */
      if (
        firstIndex === -1 &&
        secondIndex === -1
      ) {
        return first.category
          .localeCompare(
            second.category
          )
      }

      if (
        firstIndex === -1
      ) {
        return 1
      }

      if (
        secondIndex === -1
      ) {
        return -1
      }

      return (
        firstIndex -
        secondIndex
      )
    }
  )


  /*
   * --------------------------------
   * SELECTED CATEGORY RECORDS
   * --------------------------------
   */

  const selectedCategoryTransactions =
    selectedCategory
      ? tabTransactions
          .filter(
            (
              transaction
            ) =>
              getTransactionCategory(
                transaction
              ) ===
              selectedCategory
          )
          .sort(
            (
              first,
              second
            ) =>
              new Date(
                second.date
              ) -
              new Date(
                first.date
              )
          )
      : []


  const selectedCategoryTotal =
    selectedCategoryTransactions
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          Number(
            transaction.amount ||
            0
          ),
        0
      )


  /*
   * Search is deliberately only used
   * after opening a category.
   */
  const visibleTransactions =
    selectedCategoryTransactions
      .filter(
        (
          transaction
        ) =>
          transactionMatchesSearch(
            transaction,
            searchQuery
          )
      )


  const searchSuggestion =
    selectedCategory
      ? getSearchSuggestion(
          searchQuery,
          selectedCategoryTransactions
        )
      : null


  /*
   * --------------------------------
   * TRENDS LANDING PAGE
   * --------------------------------
   */

  if (
    trendScreen ===
    'menu'
  ) {
    return (
      <div className="min-h-screen bg-[#F7F5EF]">

        <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

          <header className="mb-8 flex items-center gap-3">

            <button
              type="button"
              onClick={
                onBack
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft
                size={20}
              />
            </button>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                {t(
                  'Trends'
                )}
              </h1>

              <p className="text-sm text-gray-500">
                {t(
                  'Understand how your farm is doing'
                )}
              </p>

            </div>

          </header>


          <section>

            <p className="mb-3 text-sm font-medium text-gray-600">
              {t(
                'Choose a view'
              )}
            </p>

            <button
              type="button"
              onClick={() => {
                setTrendScreen(
                  'list'
                )

                setSelectedCategory(
                  null
                )

                setSearchQuery('')
              }}
              className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
            >

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8E8F5]">

                <ListIcon
                  size={25}
                />

              </div>

              <div className="min-w-0 flex-1">

                <p className="text-base font-semibold text-gray-900">
                  {t(
                    'List View'
                  )}
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  {t(
                    'See detailed income and expense records'
                  )}
                </p>

              </div>

              <ArrowRight
                size={19}
                className="shrink-0 text-gray-400"
              />

            </button>

          </section>


          <p className="mt-6 text-center text-xs text-gray-400">
            {t(
              'More visualisations will be added here'
            )}
          </p>


          <p className="mt-8 pb-4 text-center text-xs text-gray-400">
            {t(
              'Krishi Book · Farm Ledger'
            )}
          </p>

        </main>

      </div>
    )
  }


  /*
   * --------------------------------
   * LIST VIEW
   * --------------------------------
   */

  return (
    <div className="min-h-screen bg-[#F7F5EF]">

      <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">


        {/* Header */}
        <header className="mb-6 flex items-center gap-3">

          <button
            type="button"
            onClick={() => {
              if (
                selectedCategory
              ) {
                showCategories()
              } else {
                setTrendScreen(
                  'menu'
                )
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label={
              selectedCategory
                ? t(
                    'Back to categories'
                  )
                : t(
                    'Trends'
                  )
            }
          >
            <ArrowLeft
              size={20}
            />
          </button>

          <div className="min-w-0">

            <h1 className="text-2xl font-bold text-gray-900">
              {t(
                'List View'
              )}
            </h1>

            <p className="truncate text-sm text-gray-500">
              {selectedCategory
                ? valueLabel(
                    selectedCategory
                  )
                : t(
                    'Choose a category to see its records'
                  )}
            </p>

          </div>

        </header>


        {/* Period */}
        <section className="mb-4">

          <label
            htmlFor="trendPeriod"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            {t(
              'View'
            )}
          </label>

          <div className="relative">

            <select
              id="trendPeriod"
              value={
                period
              }
              onChange={(
                event
              ) =>
                handlePeriodChange(
                  event.target.value
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
              size={20}
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


        {/* Custom dates */}
        {period ===
          'custom' && (
          <section className="mb-5 w-full min-w-0 overflow-hidden rounded-2xl bg-white p-5 shadow-sm">

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
                  htmlFor="trendCustomFrom"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  {t(
                    'From'
                  )}
                </label>

                <input
                  id="trendCustomFrom"
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
                      event.target.value
                    )
                  }
                  className="block w-full min-w-0 max-w-full rounded-xl border border-gray-200 bg-white px-3 py-4 text-base outline-none"
                />

              </div>


              <div className="min-w-0">

                <label
                  htmlFor="trendCustomTo"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  {t(
                    'To'
                  )}
                </label>

                <input
                  id="trendCustomTo"
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
                      event.target.value
                    )
                  }
                  className="block w-full min-w-0 max-w-full rounded-xl border border-gray-200 bg-white px-3 py-4 text-base outline-none"
                />

              </div>

            </div>

          </section>
        )}


        {/*
         * --------------------------------
         * CATEGORY OVERVIEW
         * --------------------------------
         */}
        {!selectedCategory && (
          <>

            {/* Expense / Income */}
            <section className="mb-5 rounded-2xl bg-white p-1.5 shadow-sm">

              <div className="grid grid-cols-2 gap-1">

                <button
                  type="button"
                  onClick={() =>
                    handleTabChange(
                      'expense'
                    )
                  }
                  className={`rounded-xl px-4 py-3.5 text-base font-semibold transition ${
                    activeTab ===
                    'expense'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {t(
                    'Expense'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleTabChange(
                      'income'
                    )
                  }
                  className={`rounded-xl px-4 py-3.5 text-base font-semibold transition ${
                    activeTab ===
                    'income'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {t(
                    'Income'
                  )}
                </button>

              </div>

            </section>


            {/* Overall total */}
            <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    {activeTab ===
                    'expense'
                      ? t(
                          'Expenses'
                        )
                      : t(
                          'Income'
                        )}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">

                    {
                      tabTransactions.length
                    }{' '}

                    {t(
                      tabTransactions.length ===
                      1
                        ? 'record'
                        : 'records'
                    )}

                    {' · '}

                    {
                      periodLabels[
                        period
                      ]
                    }

                  </p>

                </div>

                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    activeTabTotal
                  )}
                </p>

              </div>

            </section>


            {/* Categories title */}
            <section className="mb-3">

              <h2 className="text-lg font-bold text-gray-900">
                {t(
                  'Categories'
                )}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {t(
                  'Choose a category to see its records'
                )}
              </p>

            </section>


            {/* Empty */}
            {categoryGroups.length ===
            0 ? (
              <section className="rounded-2xl bg-white p-7 text-center shadow-sm">

                <p className="text-sm font-medium text-gray-700">
                  {activeTab ===
                  'expense'
                    ? t(
                        'No expenses found'
                      )
                    : t(
                        'No income found'
                      )}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  {t(
                    'There are no records for this period.'
                  )}
                </p>

              </section>
            ) : (
              <section className="space-y-3">

                {categoryGroups.map(
                  (
                    group
                  ) => (
                    <button
                      key={
                        group.category
                      }
                      type="button"
                      onClick={() =>
                        openCategory(
                          group.category
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
                    >

                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                          activeTab ===
                          'expense'
                            ? 'bg-[#FCE8E4]'
                            : 'bg-[#E4F1E7]'
                        }`}
                      >

                        {activeTab ===
                        'expense' ? (
                          <TrendingDown
                            size={23}
                          />
                        ) : (
                          <TrendingUp
                            size={23}
                          />
                        )}

                      </div>


                      <div className="min-w-0 flex-1">

                        {/*
                         * Category name +
                         * category total.
                         */}
                        <div className="flex items-start justify-between gap-3">

                          <p className="min-w-0 text-base font-semibold leading-5 text-gray-900">
                            {valueLabel(
                              group.category
                            )}
                          </p>

                          <p className="shrink-0 text-base font-bold text-gray-900">
                            {formatCurrency(
                              group.total
                            )}
                          </p>

                        </div>


                        <p className="mt-2 text-sm text-gray-500">

                          {
                            group.count
                          }{' '}

                          {t(
                            group.count ===
                            1
                              ? 'record'
                              : 'records'
                          )}

                        </p>

                      </div>


                      <ChevronRight
                        size={20}
                        className="shrink-0 text-gray-400"
                      />

                    </button>
                  )
                )}

              </section>
            )}

          </>
        )}


        {/*
         * --------------------------------
         * CATEGORY DETAIL
         * --------------------------------
         */}
        {selectedCategory && (
          <>

            {/* Breadcrumb */}
            <nav
              className="mb-4 overflow-hidden rounded-xl bg-white px-4 py-3 shadow-sm"
              aria-label="Breadcrumb"
            >

              <div className="flex min-w-0 items-center gap-1.5 text-sm">

                <button
                  type="button"
                  onClick={
                    showCategories
                  }
                  className="shrink-0 font-medium text-gray-500"
                >
                  {t(
                    'List View'
                  )}
                </button>

                <ChevronRight
                  size={15}
                  className="shrink-0 text-gray-300"
                />

                <button
                  type="button"
                  onClick={
                    showCategories
                  }
                  className="shrink-0 font-medium text-gray-500"
                >
                  {activeTab ===
                  'expense'
                    ? t(
                        'Expenses'
                      )
                    : t(
                        'Income'
                      )}
                </button>

                <ChevronRight
                  size={15}
                  className="shrink-0 text-gray-300"
                />

                <span className="min-w-0 truncate font-semibold text-gray-900">
                  {valueLabel(
                    selectedCategory
                  )}
                </span>

              </div>

            </nav>


            {/* Category summary */}
            <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                {t(
                  'Category total'
                )}
              </p>

              <h2 className="mt-1 text-xl font-bold leading-6 text-gray-900">
                {valueLabel(
                  selectedCategory
                )}
              </h2>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {formatCurrency(
                  selectedCategoryTotal
                )}
              </p>

              <p className="mt-2 text-sm text-gray-500">

                {
                  selectedCategoryTransactions
                    .length
                }{' '}

                {t(
                  selectedCategoryTransactions
                    .length ===
                  1
                    ? 'record'
                    : 'records'
                )}

                {' · '}

                {
                  periodLabels[
                    period
                  ]
                }

              </p>

            </section>


            {/* Search within category */}
            {selectedCategoryTransactions
              .length >
              0 && (
              <TransactionSearch
                query={
                  searchQuery
                }
                onChange={
                  setSearchQuery
                }
                suggestion={
                  searchSuggestion
                }
              />
            )}


            {/* No search matches */}
            {visibleTransactions.length ===
              0 ? (
              <section className="rounded-2xl bg-white p-7 text-center shadow-sm">

                <p className="text-sm font-medium text-gray-700">

                  {searchQuery
                    ? t(
                        'No matching records found'
                      )
                    : activeTab ===
                        'expense'
                      ? t(
                          'No expenses found'
                        )
                      : t(
                          'No income found'
                        )}

                </p>

                <p className="mt-1 text-sm text-gray-400">

                  {searchQuery
                    ? t(
                        'Try another word or check the suggested spelling.'
                      )
                    : t(
                        'There are no records for this period.'
                      )}

                </p>

              </section>
            ) : (
              <section className="space-y-3">

                {visibleTransactions.map(
                  (
                    transaction
                  ) => {
                    const isIncome =
                      transaction.type ===
                      'income'

                    const isLabour =
                      !isIncome &&
                      selectedCategory ===
                        'Labour'

                    const hasSaleDetails =
                      isIncome &&
                      transaction.quantity !=
                        null &&
                      transaction.rate !=
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
                      menCount *
                      menRate

                    const womenTotal =
                      womenCount *
                      womenRate

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


                    return (
                      <div
                        key={
                          transaction.id
                        }
                        className="rounded-2xl bg-white p-4 shadow-sm"
                      >

                        {/*
                         * The category is already
                         * clearly visible above.
                         *
                         * Lead each record with
                         * DATE + AMOUNT instead.
                         */}
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

                            <p className="font-semibold text-gray-900">
                              {formatDate(
                                transaction.date,
                                {
                                  day:
                                    'numeric',

                                  month:
                                    'short',

                                  year:
                                    'numeric',
                                }
                              )}
                            </p>


                            <p className="mt-1 text-xs text-gray-500">

                              {isIncome
                                ? valueLabel(
                                    transaction.incomeType
                                  )
                                : t(
                                    'Expense'
                                  )}

                            </p>

                          </div>


                          <p className="shrink-0 text-base font-bold text-gray-900">

                            {isIncome
                              ? '+'
                              : '-'}

                            {formatCurrency(
                              transaction.amount
                            )}

                          </p>

                        </div>


                        {/* Sale details */}
                        {hasSaleDetails && (
                          <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                            <p className="text-xs font-medium text-gray-500">
                              {t(
                                'Sale details'
                              )}
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700">

                              {Number(
                                transaction.quantity
                              ).toLocaleString(
                                'en-IN'
                              )}{' '}

                              {transaction.crop ===
                              'Coconut'
                                ? t(
                                    'coconuts'
                                  )
                                : 'kg'}

                              {' × '}

                              {formatCurrency(
                                transaction.rate
                              )}

                              {transaction.crop ===
                              'Coconut'
                                ? ` / ${t(
                                    'coconut'
                                  )}`
                                : ' / kg'}

                            </p>

                          </div>
                        )}


                        {/* New Labour details */}
                        {hasNewLabourDetails && (
                          <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                            <p className="mb-2 text-xs font-medium text-gray-500">
                              {t(
                                'Labour details'
                              )}
                            </p>


                            {menCount >
                              0 && (
                              <div className="mb-2 flex items-center justify-between gap-3">

                                <span className="text-sm text-gray-700">
                                  {t(
                                    'Men'
                                  )}
                                </span>

                                <span className="text-right text-sm font-medium text-gray-900">

                                  {
                                    menCount
                                  }

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


                            {womenCount >
                              0 && (
                              <div className="flex items-center justify-between gap-3">

                                <span className="text-sm text-gray-700">
                                  {t(
                                    'Women'
                                  )}
                                </span>

                                <span className="text-right text-sm font-medium text-gray-900">

                                  {
                                    womenCount
                                  }

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


                        {/* Older Labour records */}
                        {hasLegacyLabourDetails && (
                          <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                            <p className="mb-1 text-xs font-medium text-gray-500">
                              {t(
                                'Labour details'
                              )}
                            </p>

                            <p className="text-sm font-medium text-gray-700">

                              {
                                transaction.numberOfPeople
                              }{' '}

                              {t(
                                'people'
                              )}

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
                              {t(
                                'Note'
                              )}
                            </p>

                            {/*
                             * Notes are user-entered
                             * data. Never translate
                             * or alter them.
                             */}
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


            {/* Large explicit back option */}
            <button
              type="button"
              onClick={
                showCategories
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-4 text-sm font-semibold text-gray-700 shadow-sm"
            >

              <ArrowLeft
                size={17}
              />

              {t(
                'Back to categories'
              )}

            </button>

          </>
        )}


        <p className="mt-8 pb-4 text-center text-xs text-gray-400">
          {t(
            'Krishi Book · Farm Ledger'
          )}
        </p>

      </main>

    </div>
  )
}

export default Trends