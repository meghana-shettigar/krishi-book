import { ArrowLeft, TrendingDown, TrendingUp, Pencil, Trash2 } from 'lucide-react'
import { getTransactions, deleteTransaction } from '../utils/storage'
import {
  filterTransactions,
  calculateTotals,
  formatCurrency,
} from '../utils/calculations'

function Details({
  period,
  onBack,
  onEdit,
}) {
const transactions = getTransactions()

  const filteredTransactions = filterTransactions(
    transactions,
    period
  )

  const totals = calculateTotals(filteredTransactions)

  const periodLabels = {
    day: 'Today',
    month: 'This Month',
    year: 'This Year',
  }
  const handleDelete = (transactionId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this transaction?'
  )

  if (!confirmed) {
    return
  }

  deleteTransaction(transactionId)

  window.location.reload()
}

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
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
              Details
            </h1>

            <p className="text-sm text-gray-500">
              {periodLabels[period]}
            </p>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Income
            </span>

            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(totals.income)}
            </span>
          </div>

          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Expenses
            </span>

            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(totals.expenses)}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Profit / Loss
              </span>

              <span
                className={`text-2xl font-bold ${
                  totals.profitLoss < 0
                    ? 'text-red-600'
                    : 'text-gray-900'
                }`}
              >
                {formatCurrency(totals.profitLoss)}
              </span>
            </div>
          </div>

        </section>

        {/* Transactions */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Transactions
            </h2>

            <span className="text-sm text-gray-500">
              {filteredTransactions.length}
            </span>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                No transactions for this period.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...filteredTransactions]
                .sort(
                  (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
                )
                .map((transaction) => (
                  <div
  key={transaction.id}
  className="rounded-2xl bg-white p-4 shadow-sm"
>
  <div className="flex items-center gap-4">

    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
        transaction.type === 'income'
          ? 'bg-[#E4F1E7]'
          : 'bg-[#FCE8E4]'
      }`}
    >
      {transaction.type === 'income' ? (
        <TrendingUp size={21} />
      ) : (
        <TrendingDown size={21} />
      )}
    </div>

    <div className="min-w-0 flex-1">
      <p className="truncate font-medium text-gray-900">
        {transaction.type === 'income'
          ? transaction.crop
          : transaction.expenseType}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {transaction.type === 'income'
          ? transaction.incomeType
          : transaction.category}
        {' · '}
        {formatDate(transaction.date)}
      </p>
    </div>

    <p
      className={`font-semibold ${
        transaction.type === 'income'
          ? 'text-gray-900'
          : 'text-gray-700'
      }`}
    >
      {transaction.type === 'income'
        ? '+'
        : '-'}
      {formatCurrency(transaction.amount)}
    </p>

  </div>

  <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">

    <button
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
  onClick={() => onEdit(transaction)}

    >
      <Pencil size={16} />
      Edit
    </button>

    <button
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      onClick={() =>
        handleDelete(transaction.id)
      }
    >
      <Trash2 size={16} />
      Delete
    </button>

  </div>
</div>
                ))}
            </div>
          )}
        </section>

        <p className="mt-8 pb-4 text-center text-xs text-gray-400">
          Krishi Book · Farm Ledger
        </p>

      </main>
    </div>
  )
}

export default Details