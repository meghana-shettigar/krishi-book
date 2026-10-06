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
  useLanguage,
} from '../i18n/LanguageContext'

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
  const {
    t,
    valueLabel,
  } =
    useLanguage()

  const [
    incomeType,
    setIncomeType,
  ] =
    useState(
      existingTransaction
        ?.incomeType ||
      ''
    )

  const [
    crop,
    setCrop,
  ] =
    useState(
      existingTransaction
        ?.crop ||
      ''
    )

  const [
    quantity,
    setQuantity,
  ] =
    useState(
      existingTransaction
        ?.quantity ||
      ''
    )

  const [
    rate,
    setRate,
  ] =
    useState(
      existingTransaction
        ?.rate ||
      ''
    )

  const [
    amount,
    setAmount,
  ] =
    useState(
      existingTransaction
        ?.amount ||
      ''
    )

  const [
    date,
    setDate,
  ] =
    useState(
      existingTransaction
        ?.date ||
      new Date()
        .toISOString()
        .split('T')[0]
    )

  const [
    notes,
    setNotes,
  ] =
    useState(
      existingTransaction
        ?.notes ||
      ''
    )

  const isSold =
    incomeType ===
    'Sold'

  const calculatedTotal =
    Number(
      quantity ||
      0
    ) *
    Number(
      rate ||
      0
    )

  const finalAmount =
    isSold
      ? calculatedTotal
      : Number(
          amount ||
          0
        )

  const handleIncomeTypeChange =
    (
      newType
    ) => {
      setIncomeType(
        newType
      )

      if (
        newType ===
        'Sold'
      ) {
        setCrop('')
      } else {
        /*
         * Still stores canonical
         * English in Firestore.
         */
        setCrop(
          newType
        )
      }
    }

  const handleSave =
    () => {
      if (
        !incomeType
      ) {
        alert(
          t(
            'Please choose the income type.'
          )
        )

        return
      }

      if (
        isSold &&
        !crop
      ) {
        alert(
          t(
            'Please choose what you sold.'
          )
        )

        return
      }

      if (
        finalAmount <=
        0
      ) {
        alert(
          t(
            'Please enter the amount.'
          )
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
          existingTransaction
            ?.id ||
          Date.now(),

        type:
          'income',

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
            ? Number(
                rate
              )
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
          t(
            'Income updated successfully!'
          )
        )
      } else {
        saveTransaction(
          income
        )

        alert(
          t(
            'Income saved successfully!'
          )
        )
      }

      onBack()
    }

  const readyForDetails =
    isSold
      ? Boolean(
          crop
        )
      : Boolean(
          incomeType
        )

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
              size={
                20
              }
            />
          </button>

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              {t(
                'Record Income'
              )}
            </h1>

            <p className="text-sm text-gray-500">
              {t(
                'What money did you receive?'
              )}
            </p>

          </div>

        </header>

        <section className="mb-5">

          <label
            htmlFor="incomeType"
            className="mb-2 block text-sm font-medium text-gray-600"
          >
            {t(
              'Income Type'
            )}
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
                  event
                    .target
                    .value
                )
              }
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
            >

              <option value="">
                {t(
                  'Choose income type'
                )}
              </option>

              {INCOME_TYPES.map(
                (
                  item
                ) => (
                  <option
                    key={
                      item
                    }
                    value={
                      item
                    }
                  >
                    {valueLabel(
                      item
                    )}
                  </option>
                )
              )}

            </select>

            <ChevronDown
              size={
                20
              }
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

          </div>

        </section>

        {isSold && (
          <section className="mb-5">

            <label
              htmlFor="crop"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              {t(
                'What did you sell?'
              )}
            </label>

            <div className="relative">

              <select
                id="crop"
                value={
                  crop
                }
                onChange={(
                  event
                ) =>
                  setCrop(
                    event
                      .target
                      .value
                  )
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
              >

                <option value="">
                  {t(
                    'Choose'
                  )}
                </option>

                {SOLD_TYPES.map(
                  (
                    item
                  ) => (
                    <option
                      key={
                        item
                      }
                      value={
                        item
                      }
                    >
                      {valueLabel(
                        item
                      )}
                    </option>
                  )
                )}

              </select>

              <ChevronDown
                size={
                  20
                }
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

            </div>

          </section>
        )}

        {isSold &&
          crop && (
          <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">

            <p className="mb-4 text-base font-semibold text-gray-900">
              {t(
                'Sale details'
              )}
            </p>

            <div className="mb-4">

              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                {crop ===
                'Coconut'
                  ? t(
                      'Number of coconuts'
                    )
                  : t(
                      'Quantity (kg)'
                    )}
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
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="500"
                  className="w-full rounded-xl px-4 py-4 text-base outline-none"
                />

                <span className="pr-4 text-sm text-gray-500">
                  {crop ===
                  'Coconut'
                    ? t(
                        'coconuts'
                      )
                    : t(
                        'kg'
                      )}
                </span>

              </div>

            </div>

            <div className="mb-4">

              <label
                htmlFor="rate"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                {crop ===
                'Coconut'
                  ? t(
                      'Rate per coconut'
                    )
                  : t(
                      'Rate per kg'
                    )}
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
                  value={
                    rate
                  }
                  onChange={(
                    event
                  ) =>
                    setRate(
                      event
                        .target
                        .value
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
                  {t(
                    'Total sale'
                  )}
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

        {!isSold &&
          incomeType && (
          <section className="mb-5">

            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              {t(
                'Amount'
              )}
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
                value={
                  amount
                }
                onChange={(
                  event
                ) =>
                  setAmount(
                    event
                      .target
                      .value
                  )
                }
                placeholder="5000"
                className="w-full rounded-xl px-3 py-4 text-base outline-none"
              />

            </div>

          </section>
        )}

        {readyForDetails && (
          <>
            <section className="mb-5">

              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                {t(
                  'Date'
                )}
              </label>

              <input
                id="date"
                lang="en-IN"
                type="date"
                value={
                  date
                }
                onChange={(
                  event
                ) =>
                  setDate(
                    event
                      .target
                      .value
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
                {t(
                  'Notes'
                )}
              </label>

              <textarea
                id="notes"
                value={
                  notes
                }
                onChange={(
                  event
                ) =>
                  setNotes(
                    event
                      .target
                      .value
                  )
                }
                placeholder={
                  t(
                    'Optional'
                  )
                }
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

              <Save
                size={
                  20
                }
              />

              {existingTransaction
                ? t(
                    'Update Income'
                  )
                : t(
                    'Save Income'
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

export default Income