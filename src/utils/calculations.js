export function getStartDate(period) {
  const today = new Date()

  if (period === 'day') {
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
  }

  if (period === 'month') {
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
  }

  if (period === 'year') {
    return new Date(
      today.getFullYear(),
      0,
      1
    )
  }

  return null
}

export function filterTransactions(
  transactions,
  period
) {
  const startDate = getStartDate(period)

  if (!startDate) {
    return transactions
  }

  return transactions.filter((transaction) => {
    const transactionDate = new Date(
      `${transaction.date}T00:00:00`
    )

    return transactionDate >= startDate
  })
}

export function calculateTotals(transactions) {
  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === 'income'
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    )

  const expenses = transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense'
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    )

  const profitLoss = income - expenses

  return {
    income,
    expenses,
    profitLoss,
  }
}

export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`
}