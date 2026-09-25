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

const SOLD_TYPES = [
  'Coconut',
  'Supari',
  'Pepper',
  'Vegetable',
  'Other',
]

const INCOME_TYPES = [
  'Sold',
  'Agricultural benefit',
  'Other',
]

function Income({
  onBack,
  existingTransaction,
}) {
  const [
    incomeType,
    setIncomeType,
  ] = useState(
    existingTransaction
      ?.incomeType || ''
  )

  const [crop, setCrop] =
    useState(
      existingTransaction?.crop ||
        ''
    )

  const [
    quantity,
    setQuantity,
  ] = useState(
    existingTransaction
      ?.quantity || ''
  )

  const [rate, setRate] =
    useState(
      existingTransaction?.rate ||
        ''
    )

  const [amount, setAmount] =
    useState(
      existingTransaction
        ?.amount || ''
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

  const isSold =
    incomeType === 'Sold'

  const calculatedTotal =
    Number(quantity || 0) *
    Number(rate || 0)

  const finalAmount =
    isSold
      ? calculatedTotal
      : Number(amount || 0)

  const handleIncomeTypeChange =
    (newType) => {
      setIncomeType(
        newType
      )

      /*
       * Sold needs the crop/product
       * dropdown.
       *
       * For the other two options we
       * store the income type itself
       * internally as crop. This keeps
       * Details, Trends and Search fully
       * compatible without making your
       * parents choose it twice.
       */
      if (
        newType === 'Sold'
      ) {
        setCrop('')
      } else {
        setCrop(
          newType
        )
      }
    }

  const handleSave = () => {
    if (!incomeType) {
      alert(
        'Please choose the income type.'
      )

      return
    }

    if (
      isSold &&
      !crop
    ) {
      alert(
        'Please choose what you sold.'
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

    const resolvedCrop =
      isSold
        ? crop
        : incomeType

    const income = {
      ...(existingTransaction ||
        {}),

      id:
        existingTransaction?.id ||
        Date.now(),

      type: 'income',

      incomeType,

      crop:
        resolvedCrop,

      amount:
        finalAmount,

      quantity:
        isSold
          ? Number(
              quantity
            )
          : null,

      rate:
        isSold
          ? Number(rate)
          : null,

      date,

      notes,
    }

    if (
      existingTransaction
    ) {
      updateTransaction(
        income
      )

      alert(
        'Income updated successfully!'
      )
    } else {
      saveTransaction(
        income
      )

      alert(
        'Income saved successfully!'
      )
    }

    onBack()
  }

  const readyForDetails =
    isSold
      ? Boolean(crop)
      : Boolean(incomeType)

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
              Record Income
            </h1>

            <p className="text-sm text-gray-500">
              What money did you receive?
            </p>

          </div>

        </header>

        {/* Income Type */}
        <section className="mb-5">

          <label
            htmlFor="incomeType"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            Income Type
          </label>

          <div className="relative">

            <select
              id="incomeType"
              value={
                incomeType
              }
              onChange={(
                event
              ) =>
                handleIncomeTypeChange(
                  event.target
                    .value
                )
              }
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
            >

              <option value="">
                Choose income type
              </option>

              {INCOME_TYPES.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
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

        {/* Sold product */}
        {isSold && (
          <section className="mb-5">

            <label
              htmlFor="crop"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              What did you sell?
            </label>

            <div className="relative">

              <select
                id="crop"
                value={crop}
                onChange={(
                  event
                ) =>
                  setCrop(
                    event.target.value
                  )
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
              >

                <option value="">
                  Choose
                </option>

                {SOLD_TYPES.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
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

        {/* Sold details */}
        {isSold && crop && (
          <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">

            <p className="mb-4 text-base font-semibold text-gray-900">
              Sale details
            </p>

            {/* Quantity */}
            <div className="mb-4">

              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                {crop ===
                'Coconut'
                  ? 'Number of coconuts'
                  : 'Quantity (kg)'}
              </label>

              <div className="flex items-center rounded-xl border border-gray-200 bg-white">

                <input
                  id="quantity"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={
                    quantity
                  }
                  onChange={(
                    event
                  ) =>
                    setQuantity(
                      event.target
                        .value
                    )
                  }
                  placeholder="500"
                  className="w-full rounded-xl px-4 py-4 text-base outline-none"
                />

                <span className="pr-4 text-sm text-gray-500">
                  {crop ===
                  'Coconut'
                    ? 'coconuts'
                    : 'kg'}
                </span>

              </div>

            </div>

            {/* Rate */}
            <div className="mb-4">

              <label
                htmlFor="rate"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                {crop ===
                'Coconut'
                  ? 'Rate per coconut'
                  : 'Rate per kg'}
              </label>

              <div className="flex items-center rounded-xl border border-gray-200 bg-white">

                <span className="pl-4 text-gray-500">
                  ₹
                </span>

                <input
                  id="rate"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={rate}
                  onChange={(
                    event
                  ) =>
                    setRate(
                      event.target.value
                    )
                  }
                  placeholder={
                    crop ===
                    'Coconut'
                      ? '25'
                      : '42'
                  }
                  className="w-full rounded-xl px-3 py-4 text-base outline-none"
                />

              </div>

            </div>

            {calculatedTotal >
              0 && (
              <div className="rounded-xl bg-[#E4F1E7] p-4">

                <p className="text-sm text-gray-600">
                  Total sale
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  ₹
                  {calculatedTotal.toLocaleString(
                    'en-IN'
                  )}
                </p>

              </div>
            )}

          </section>
        )}

        {/* Agricultural benefit / Other */}
        {!isSold &&
          incomeType && (
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
                    event.target.value
                  )
                }
                placeholder="5000"
                className="w-full rounded-xl px-3 py-4 text-base outline-none"
              />

            </div>

          </section>
        )}

        {/* Date / Notes / Save */}
        {readyForDetails && (
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
                ? 'Update Income'
                : 'Save Income'}

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

export default Income