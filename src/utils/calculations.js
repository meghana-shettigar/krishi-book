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

export function getPeriodDateLabel(
  period,
  customFrom = '',
  customTo = ''
) {
  const today = new Date()

  const formatDate = (date) =>
    date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  const parseDate = (dateString) => {
    if (!dateString) {
      return null
    }

    const [year, month, day] =
      dateString.split('-').map(Number)

    return new Date(
      year,
      month - 1,
      day
    )
  }

  if (period === 'day') {
    return formatDate(today)
  }

  if (period === 'month') {
    const firstDay =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )

    const lastDay =
      new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      )

    return `${formatDate(
      firstDay
    )} – ${formatDate(lastDay)}`
  }

  if (period === 'year') {
    const firstDay =
      new Date(
        today.getFullYear(),
        0,
        1
      )

    const lastDay =
      new Date(
        today.getFullYear(),
        11,
        31
      )

    return `${formatDate(
      firstDay
    )} – ${formatDate(lastDay)}`
  }

  if (period === 'custom') {
    const fromDate =
      parseDate(customFrom)

    const toDate =
      parseDate(customTo)

    if (fromDate && toDate) {
      return `${formatDate(
        fromDate
      )} – ${formatDate(toDate)}`
    }

    if (fromDate) {
      return `From ${formatDate(
        fromDate
      )}`
    }

    if (toDate) {
      return `Up to ${formatDate(
        toDate
      )}`
    }

    return 'Select a date range'
  }

  return ''
}