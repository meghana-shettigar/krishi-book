import {
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Pencil,
  Trash2,
} from 'lucide-react'

import {
  getTransactions,
  deleteTransaction,
} from '../utils/storage'

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

  const totals = calculateTotals(
    filteredTransactions
  )

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
                {formatCurrency(
                  totals.profitLoss
                )}
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
                .map((transaction) => {

                  const isIncome =
                    transaction.type === 'income'

                  const isLabour =
                    !isIncome &&
                    transaction.category === 'Manual Labour'

                  const hasSaleDetails =
                    isIncome &&
                    transaction.quantity != null &&
                    transaction.rate != null

                  const menTotal =
                    Number(
                      transaction.menCount || 0
                    ) *
                    Number(
                      transaction.menDailyCharge || 0
                    )

                  const womenTotal =
                    Number(
                      transaction.womenCount || 0
                    ) *
                    Number(
                      transaction.womenDailyCharge || 0
                    )

                  const hasMen =
                    Number(
                      transaction.menCount || 0
                    ) > 0

                  const hasWomen =
                    Number(
                      transaction.womenCount || 0
                    ) > 0

                  return (
                    <div
                      key={transaction.id}
                      className="rounded-2xl bg-white p-4 shadow-sm"
                    >

                      {/* Transaction summary */}
                      <div className="flex items-start gap-3">

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            isIncome
                              ? 'bg-[#E4F1E7]'
                              : 'bg-[#FCE8E4]'
                          }`}
                        >
                          {isIncome ? (
                            <TrendingUp size={21} />
                          ) : (
                            <TrendingDown size={21} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900">
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
                          {isIncome ? '+' : '-'}
                          {formatCurrency(
                            transaction.amount
                          )}
                        </p>

                      </div>

                      {/* Sale details */}
                      {hasSaleDetails && (
                        <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                          <p className="text-sm font-medium text-gray-700">
                            {Number(
                              transaction.quantity
                            ).toLocaleString('en-IN')}{' '}
                            {transaction.crop === 'Coconut'
                              ? 'coconuts'
                              : 'kg'}
                            {' × '}
                            {formatCurrency(
                              transaction.rate
                            )}
                            {transaction.crop === 'Coconut'
                              ? ' / coconut'
                              : ' / kg'}
                          </p>

                        </div>
                      )}

                      {/* Manual labour details */}
                      {isLabour && (
                        <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                          <p className="mb-2 text-xs font-medium text-gray-500">
                            Labour details
                          </p>

                          {/* Men */}
                          {hasMen && (
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <span className="text-sm text-gray-700">
                                Men
                              </span>

                              <span className="text-sm font-medium text-gray-900">
                                {transaction.menCount}{' '}
                                ×{' '}
                                {formatCurrency(
                                  transaction.menDailyCharge
                                )}{' '}
                                ={' '}
                                {formatCurrency(
                                  menTotal
                                )}
                              </span>
                            </div>
                          )}

                          {/* Women */}
                          {hasWomen && (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-gray-700">
                                Women
                              </span>

                              <span className="text-sm font-medium text-gray-900">
                                {transaction.womenCount}{' '}
                                ×{' '}
                                {formatCurrency(
                                  transaction.womenDailyCharge
                                )}{' '}
                                ={' '}
                                {formatCurrency(
                                  womenTotal
                                )}
                              </span>
                            </div>
                          )}

                        </div>
                      )}

                      {/* Notes */}
                      {transaction.notes?.trim() && (
                        <div className="mt-4 rounded-xl bg-[#F7F5EF] px-4 py-3">

                          <p className="mb-1 text-xs font-medium text-gray-500">
                            Note
                          </p>

                          <p className="text-sm leading-5 text-gray-700">
                            {transaction.notes}
                          </p>

                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">

                        <button
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                          onClick={() =>
                            onEdit(transaction)
                          }
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleDelete(
                              transaction.id
                            )
                          }
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>

                      </div>

                    </div>
                  )
                })}
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