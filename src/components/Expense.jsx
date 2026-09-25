import {
  useState,
} from 'react'

import {
  ArrowLeft,
  ChevronDown,
  Save,
} from 'lucide-react'

import {
  saveTransaction,
  updateTransaction,
} from '../utils/storage'

import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_VERSION,
  getDefaultExpenseType,
  getExpenseOptions,
  hasExpenseSubcategories,
  mapExpenseToV2,
} from '../data/expenseCategories'

function Expense({
  onBack,
  existingTransaction,
}) {
  /*
   * This also lets old transactions
   * open correctly before the DB
   * migration has been performed.
   */
  const existingMapped =
    existingTransaction
      ? mapExpenseToV2(
          existingTransaction.category,
          existingTransaction.expenseType
        )
      : null

  const [
    category,
    setCategory,
  ] = useState(
    existingMapped?.category ||
      ''
  )

  const [
    expenseType,
    setExpenseType,
  ] = useState(
    existingMapped?.expenseType ||
      ''
  )

  const [amount, setAmount] =
    useState(
      existingTransaction?.amount ||
        ''
    )

  /*
   * Labour
   *
   * Fall back to the older labour
   * fields so old records remain
   * editable.
   */
  const [
    menCount,
    setMenCount,
  ] = useState(
    existingTransaction
      ?.menCount ??
      existingTransaction
        ?.numberOfPeople ??
      ''
  )

  const [
    menDailyCharge,
    setMenDailyCharge,
  ] = useState(
    existingTransaction
      ?.menDailyCharge ??
      existingTransaction
        ?.dailyCharge ??
      ''
  )

  const [
    womenCount,
    setWomenCount,
  ] = useState(
    existingTransaction
      ?.womenCount ?? ''
  )

  const [
    womenDailyCharge,
    setWomenDailyCharge,
  ] = useState(
    existingTransaction
      ?.womenDailyCharge ?? ''
  )

  const [date, setDate] =
    useState(
      existingTransaction?.date ||
        new Date()
          .toISOString()
          .split('T')[0]
    )

  const [notes, setNotes] =
    useState(
      existingTransaction?.notes ||
        ''
    )

  const isLabour =
    category === 'Labour'

  const hasSubcategories =
    hasExpenseSubcategories(
      category
    )

  const effectiveExpenseType =
    expenseType ||
    getDefaultExpenseType(
      category
    )

  const menTotal =
    Number(menCount || 0) *
    Number(
      menDailyCharge || 0
    )

  const womenTotal =
    Number(
      womenCount || 0
    ) *
    Number(
      womenDailyCharge || 0
    )

  const labourTotal =
    menTotal + womenTotal

  const finalAmount =
    isLabour
      ? labourTotal
      : Number(amount || 0)

  const handleCategoryChange =
    (newCategory) => {
      setCategory(
        newCategory
      )

      /*
       * Categories with no second
       * dropdown automatically use
       * their category as expenseType.
       */
      setExpenseType(
        getDefaultExpenseType(
          newCategory
        )
      )
    }

  const handleSave = () => {
    if (!category) {
      alert(
        'Please choose what you spent on.'
      )

      return
    }

    if (
      !effectiveExpenseType
    ) {
      alert(
        'Please choose the expense type.'
      )

      return
    }

    if (
      finalAmount <= 0
    ) {
      alert(
        'Please enter the amount.'
      )

      return
    }

    /*
     * Spread the existing transaction
     * first so migration fields such as
     * legacyCategory are NEVER lost
     * when an old record is edited.
     */
    const expense = {
      ...(existingTransaction ||
        {}),

      id:
        existingTransaction?.id ||
        Date.now(),

      type: 'expense',

      category,

      expenseType:
        effectiveExpenseType,

      categoryVersion:
        EXPENSE_CATEGORY_VERSION,

      amount:
        finalAmount,

      date,

      notes,

      menCount:
        isLabour
          ? Number(
              menCount || 0
            )
          : 0,

      menDailyCharge:
        isLabour
          ? Number(
              menDailyCharge ||
                0
            )
          : 0,

      womenCount:
        isLabour
          ? Number(
              womenCount || 0
            )
          : 0,

      womenDailyCharge:
        isLabour
          ? Number(
              womenDailyCharge ||
                0
            )
          : 0,
    }

    if (
      existingTransaction
    ) {
      updateTransaction(
        expense
      )

      alert(
        'Expense updated successfully!'
      )
    } else {
      saveTransaction(
        expense
      )

      alert(
        'Expense saved successfully!'
      )
    }

    onBack()
  }

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
            <ArrowLeft
              size={20}
            />
          </button>

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Record Expense
            </h1>

            <p className="text-sm text-gray-500">
              What did you spend on?
            </p>

          </div>

        </header>

        {/* Category */}
        <section className="mb-5">

          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            Category
          </label>

          <div className="relative">

            <select
              id="category"
              value={category}
              onChange={(event) =>
                handleCategoryChange(
                  event.target.value
                )
              }
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
            >

              <option value="">
                Choose category
              </option>

              {EXPENSE_CATEGORIES.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {
                      item.label
                    }
                  </option>
                )
              )}

            </select>

            <ChevronDown
              size={20}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

          </div>

        </section>

        {/* Expense Type */}
        {category &&
          hasSubcategories && (
          <section className="mb-5">

            <label
              htmlFor="expenseType"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              What did you spend on?
            </label>

            <div className="relative">

              <select
                id="expenseType"
                value={
                  expenseType
                }
                onChange={(
                  event
                ) =>
                  setExpenseType(
                    event.target
                      .value
                  )
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
              >

                <option value="">
                  Choose expense
                </option>

                {getExpenseOptions(
                  category
                ).map(
                  (item) => (
                    <option
                      key={
                        item
                      }
                      value={
                        item
                      }
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

              <ChevronDown
                size={20}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

            </div>

          </section>
        )}

        {/* Labour */}
        {isLabour &&
          effectiveExpenseType && (
          <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">

            <p className="mb-4 text-base font-semibold text-gray-900">
              Labour details
            </p>

            {/* Men */}
            <div className="mb-5 rounded-xl bg-[#F7F5EF] p-4">

              <p className="mb-3 text-sm font-semibold text-gray-900">
                Men
              </p>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label
                    htmlFor="menCount"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Number of men
                  </label>

                  <input
                    id="menCount"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={
                      menCount
                    }
                    onChange={(
                      event
                    ) =>
                      setMenCount(
                        event.target
                          .value
                      )
                    }
                    placeholder="2"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
                  />

                </div>

                <div>

                  <label
                    htmlFor="menDailyCharge"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Daily rate
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-white">

                    <span className="pl-3 text-gray-500">
                      ₹
                    </span>

                    <input
                      id="menDailyCharge"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={
                        menDailyCharge
                      }
                      onChange={(
                        event
                      ) =>
                        setMenDailyCharge(
                          event.target
                            .value
                        )
                      }
                      placeholder="700"
                      className="w-full rounded-xl px-3 py-4 text-base outline-none"
                    />

                  </div>

                </div>

              </div>

              {menTotal > 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  Men: ₹
                  {menTotal.toLocaleString(
                    'en-IN'
                  )}
                </p>
              )}

            </div>

            {/* Women */}
            <div className="rounded-xl bg-[#F7F5EF] p-4">

              <p className="mb-3 text-sm font-semibold text-gray-900">
                Women
              </p>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label
                    htmlFor="womenCount"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Number of women
                  </label>

                  <input
                    id="womenCount"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={
                      womenCount
                    }
                    onChange={(
                      event
                    ) =>
                      setWomenCount(
                        event.target
                          .value
                      )
                    }
                    placeholder="3"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
                  />

                </div>

                <div>

                  <label
                    htmlFor="womenDailyCharge"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Daily rate
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-200 bg-white">

                    <span className="pl-3 text-gray-500">
                      ₹
                    </span>

                    <input
                      id="womenDailyCharge"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={
                        womenDailyCharge
                      }
                      onChange={(
                        event
                      ) =>
                        setWomenDailyCharge(
                          event.target
                            .value
                        )
                      }
                      placeholder="500"
                      className="w-full rounded-xl px-3 py-4 text-base outline-none"
                    />

                  </div>

                </div>

              </div>

              {womenTotal > 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  Women: ₹
                  {womenTotal.toLocaleString(
                    'en-IN'
                  )}
                </p>
              )}

            </div>

            {labourTotal >
              0 && (
              <div className="mt-5 rounded-xl bg-[#E4F1E7] p-4">

                <p className="text-sm text-gray-600">
                  Total labour cost
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  ₹
                  {labourTotal.toLocaleString(
                    'en-IN'
                  )}
                </p>

              </div>
            )}

          </section>
        )}

        {/* Regular Amount */}
        {!isLabour &&
          effectiveExpenseType && (
          <section className="mb-5">

            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Amount
            </label>

            <div className="flex items-center rounded-xl border border-gray-200 bg-white">

              <span className="pl-4 text-gray-500">
                ₹
              </span>

              <input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0"
                value={amount}
                onChange={(
                  event
                ) =>
                  setAmount(
                    event.target
                      .value
                  )
                }
                placeholder="4500"
                className="w-full rounded-xl px-3 py-4 text-base outline-none"
              />

            </div>

          </section>
        )}

        {/* Date + Notes + Save */}
        {effectiveExpenseType && (
          <>

            <section className="mb-5">

              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Date
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(
                  event
                ) =>
                  setDate(
                    event.target.value
                  )
                }
                className="block w-full min-w-0 max-w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
              />

            </section>

            <section className="mb-6">

              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Notes
              </label>

              <textarea
                id="notes"
                value={notes}
                onChange={(
                  event
                ) =>
                  setNotes(
                    event.target.value
                  )
                }
                placeholder="Optional"
                rows="3"
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
              />

            </section>

            <button
              type="button"
              onClick={
                handleSave
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-base font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >

              <Save size={20} />

              {existingTransaction
                ? 'Update Expense'
                : 'Save Expense'}

            </button>

          </>
        )}

        <p className="mt-8 pb-4 text-center text-xs text-gray-400">
          Krishi Book · Farm Ledger
        </p>

      </main>

    </div>
  )
}

export default Expense