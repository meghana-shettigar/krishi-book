import { useState } from 'react'
import Expense from './components/Expense'
import Details from './components/Details'
import Income from './components/Income'

import { getTransactions } from './utils/storage'
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
} from 'lucide-react'

function App() {
  const [period, setPeriod] = useState('year')
  const [screen, setScreen] = useState('home')
  const [editingTransaction, setEditingTransaction] =
    useState(null)

  const transactions = getTransactions()

const filteredTransactions = filterTransactions(
  transactions,
  period
)

const totals = calculateTotals(
  filteredTransactions
)

  const periodLabels = {
    day: 'Today',
    month: 'This Month',
    year: 'This Year',
  }

  const handleComingSoon = (feature) => {
    alert(`${feature} will be added next.`)
  }

if (screen === 'expense') {
  return (
    <Expense
      existingTransaction={editingTransaction}
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
      onBack={() => setScreen('home')}
      onEdit={(transaction) => {
        setEditingTransaction(transaction)

        if (transaction.type === 'income') {
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
      existingTransaction={editingTransaction}
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
              onChange={(event) => setPeriod(event.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 pr-10 text-base font-medium text-gray-900 outline-none"
            >
              <option value="day">Today</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            <ChevronDown
              size={20}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </section>

        {/* Profit / Loss */}
        <section className="mb-3 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-gray-500">
            {periodLabels[period]} Profit / Loss
          </p>

<p
  className={`mt-3 text-center text-4xl font-bold ${
    totals.profitLoss < 0
      ? 'text-red-600'
      : 'text-gray-900'
  }`}
>
  {formatCurrency(totals.profitLoss)}
</p>

<p className="mt-2 text-center text-sm text-gray-500">
  Income: {formatCurrency(totals.income)}
  {' · '}
  Expenses: {formatCurrency(totals.expenses)}
</p>

        </section>

        {/* View Details */}
        <button
          onClick={() => setScreen('details')}          
          className="mb-6 flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-700"
        >
          View Details
          <ArrowRight size={17} />
        </button>

        {/* Main Actions */}
        <div className="space-y-3">

          <button
            onClick={() => setScreen('expense')}            
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
            onClick={() => setScreen('income')}            
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
            onClick={() => handleComingSoon('Trends')}
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

        {/* Footer */}
        <p className="mt-10 pb-4 text-center text-xs text-gray-400">
          Krishi Book · Farm Ledger
        </p>

      </main>
    </div>
  )
}

export default App