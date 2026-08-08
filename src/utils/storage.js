const STORAGE_KEY = 'krishiBookTransactions'

export function getTransactions() {
  const storedTransactions = localStorage.getItem(STORAGE_KEY)

  if (!storedTransactions) {
    return []
  }

  try {
    return JSON.parse(storedTransactions)
  } catch (error) {
    console.error('Unable to read saved transactions:', error)
    return []
  }
}

export function saveTransaction(transaction) {
  const transactions = getTransactions()

  const updatedTransactions = [
    ...transactions,
    transaction,
  ]

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedTransactions)
  )

  return updatedTransactions
}

export function updateTransaction(updatedTransaction) {
  const transactions = getTransactions()

  const updatedTransactions = transactions.map(
    (transaction) =>
      transaction.id === updatedTransaction.id
        ? updatedTransaction
        : transaction
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedTransactions)
  )

  return updatedTransactions
}

export function deleteTransaction(transactionId) {
  const transactions = getTransactions()

  const updatedTransactions = transactions.filter(
    (transaction) =>
      transaction.id !== transactionId
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedTransactions)
  )

  return updatedTransactions
}

export function clearTransactions() {
  localStorage.removeItem(STORAGE_KEY)
}