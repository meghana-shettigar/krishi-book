import {
  formatAppDate,
  translateUi,
} from '../i18n/translations'

export function getStartDate(
  period
) {
  const today =
    new Date()

  if (
    period === 'day'
  ) {
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
  }

  if (
    period === 'month'
  ) {
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
  }

  if (
    period === 'year'
  ) {
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
  const startDate =
    getStartDate(
      period
    )

  if (!startDate) {
    return transactions
  }

  return transactions.filter(
    (
      transaction
    ) => {
      const transactionDate =
        new Date(
          `${transaction.date}T00:00:00`
        )

      return (
        transactionDate >=
        startDate
      )
    }
  )
}

export function calculateTotals(
  transactions
) {
  const income =
    transactions
      .filter(
        (
          transaction
        ) =>
          transaction.type ===
          'income'
      )
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

  const expenses =
    transactions
      .filter(
        (
          transaction
        ) =>
          transaction.type ===
          'expense'
      )
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

  return {
    income,

    expenses,

    profitLoss:
      income -
      expenses,
  }
}

/*
 * Always keep digits as 0-9.
 */
export function formatCurrency(
  amount
) {
  return `₹${Number(
    amount
  ).toLocaleString(
    'en-IN'
  )}`
}

export function getPeriodDateLabel(
  period,
  customFrom = '',
  customTo = '',
  language = 'en'
) {
  const today =
    new Date()

  const formatDate =
    (
      value
    ) =>
      formatAppDate(
        value,
        language,
        {
          day:
            'numeric',

          month:
            'short',

          year:
            'numeric',
        }
      )

  if (
    period === 'day'
  ) {
    return formatDate(
      today
    )
  }

  if (
    period === 'month'
  ) {
    const firstDay =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )

    const lastDay =
      new Date(
        today.getFullYear(),
        today.getMonth() +
          1,
        0
      )

    return `${formatDate(
      firstDay
    )} – ${formatDate(
      lastDay
    )}`
  }

  if (
    period === 'year'
  ) {
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
    )} – ${formatDate(
      lastDay
    )}`
  }

  if (
    period === 'custom'
  ) {
    if (
      customFrom &&
      customTo
    ) {
      return `${formatDate(
        customFrom
      )} – ${formatDate(
        customTo
      )}`
    }

    if (customFrom) {
      return translateUi(
        'From {date}',
        language,
        {
          date:
            formatDate(
              customFrom
            ),
        }
      )
    }

    if (customTo) {
      return translateUi(
        'Up to {date}',
        language,
        {
          date:
            formatDate(
              customTo
            ),
        }
      )
    }

    return translateUi(
      'Select date range',
      language
    )
  }

  return ''
}