import { useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  Save,
} from 'lucide-react'
import {
  saveTransaction,
  updateTransaction,
} from '../utils/storage'

const incomeTypes = {
  Sold: [
    'Coconut',
    'Supari',
    'Other',
  ],
  'Agricultural benefit': [
    'Agricultural benefit',
  ],
  Other: [
    'Other',
  ],
}

function Income({ onBack, existingTransaction }) {
const [incomeType, setIncomeType] = useState(
  existingTransaction?.incomeType || ''
)
const [crop, setCrop] = useState(
  existingTransaction?.crop || ''
)  
const [quantity, setQuantity] = useState(
  existingTransaction?.quantity || ''
)

const [rate, setRate] = useState(
  existingTransaction?.rate || ''
)
const [amount, setAmount] = useState(
  existingTransaction?.amount || ''
)

const [date, setDate] = useState(
  existingTransaction?.date ||
    new Date().toISOString().split('T')[0]
)

const [notes, setNotes] = useState(
  existingTransaction?.notes || ''
)

  const isSold = incomeType === 'Sold'

  const calculatedTotal =
    Number(quantity || 0) * Number(rate || 0)

  const finalAmount = isSold
    ? calculatedTotal
    : Number(amount || 0)

  const handleSave = () => {
    if (!incomeType) {
      alert('Please choose the income type.')
      return
    }

    if (!crop) {
      alert('Please choose what you received money for.')
      return
    }

    if (finalAmount <= 0) {
      alert('Please enter the amount.')
      return
    }

    const income = {
      id: existingTransaction?.id || Date.now(),
      type: 'income',
      incomeType,
      crop,
      amount: finalAmount,
      quantity: isSold
        ? Number(quantity)
        : null,
      rate: isSold
        ? Number(rate)
        : null,
      date,
      notes,
    }

  
    if (existingTransaction) {
  updateTransaction(income)

  alert('Income updated successfully!')
} else {
  saveTransaction(income)

  alert('Income saved successfully!')
}
    onBack()
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <main className="mx-auto min-h-screen w-full max-w-md px-5 py-6">

        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft size={20} />
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
              value={incomeType}
              onChange={(event) => {
                setIncomeType(event.target.value)
                setCrop('')
              }}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
            >
              <option value="">
                Choose income type
              </option>

              {Object.keys(incomeTypes).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={20}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </section>

        {/* Crop / Income */}
        {incomeType && (
          <section className="mb-5">
            <label
              htmlFor="crop"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              {isSold
                ? 'What did you sell?'
                : 'What was the income for?'}
            </label>

            <div className="relative">
              <select
                id="crop"
                value={crop}
                onChange={(event) =>
                  setCrop(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
              >
                <option value="">
                  Choose
                </option>

                {incomeTypes[incomeType].map(
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
                Quantity (kg)
              </label>

              <div className="flex items-center rounded-xl border border-gray-200 bg-white">
                <input
                  id="quantity"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                  placeholder="500"
                  className="w-full rounded-xl px-4 py-4 text-base outline-none"
                />

                <span className="pr-4 text-sm text-gray-500">
                  kg
                </span>
              </div>
            </div>

            {/* Rate */}
            <div className="mb-4">
              <label
                htmlFor="rate"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Rate per kg
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
                  onChange={(event) =>
                    setRate(event.target.value)
                  }
                  placeholder="42"
                  className="w-full rounded-xl px-3 py-4 text-base outline-none"
                />
              </div>
            </div>

            {/* Total */}
            {calculatedTotal > 0 && (
              <div className="rounded-xl bg-[#E4F1E7] p-4">
                <p className="text-sm text-gray-600">
                  Total sale
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  ₹{calculatedTotal.toLocaleString('en-IN')}
                </p>
              </div>
            )}

          </section>
        )}

        {/* Other income amount */}
        {!isSold && crop && (
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
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="5000"
                className="w-full rounded-xl px-3 py-4 text-base outline-none"
              />
            </div>
          </section>
        )}

        {/* Date and notes */}
        {crop && (
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
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
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
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Optional"
                rows="3"
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-4 text-base outline-none"
              />
            </section>

            <button
              onClick={handleSave}
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