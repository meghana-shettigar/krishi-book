import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'

import {
  auth,
  db,
} from '../firebase/firebase'

const STORAGE_KEY =
  'krishiBookTransactions'

const CLOUD_READY_KEY =
  'krishiBookCloudReady'

export function getTransactions() {
  const storedTransactions =
    localStorage.getItem(
      STORAGE_KEY
    )

  if (!storedTransactions) {
    return []
  }

  try {
    return JSON.parse(
      storedTransactions
    )
  } catch (error) {
    console.error(
      'Unable to read saved transactions:',
      error
    )

    return []
  }
}

function saveTransactionsLocally(
  transactions
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      transactions
    )
  )
}

function getCloudCollection() {
  const user =
    auth.currentUser

  if (!user) {
    return null
  }

  return collection(
    db,
    'users',
    user.uid,
    'transactions'
  )
}

function getCloudTransaction(
  transactionId
) {
  const user =
    auth.currentUser

  if (!user) {
    return null
  }

  return doc(
    db,
    'users',
    user.uid,
    'transactions',
    String(transactionId)
  )
}

/*
 * SAVE TRANSACTION
 *
 * Saves locally immediately.
 * Also sends the same transaction
 * to Firestore if logged in.
 */
export function saveTransaction(
  transaction
) {
  const transactions =
    getTransactions()

  const updatedTransactions = [
    ...transactions,
    transaction,
  ]

  saveTransactionsLocally(
    updatedTransactions
  )

  const cloudTransaction =
    getCloudTransaction(
      transaction.id
    )

  if (cloudTransaction) {
    setDoc(
      cloudTransaction,
      transaction
    ).catch((error) => {
      console.error(
        'Unable to save transaction to cloud:',
        error
      )
    })
  }

  return updatedTransactions
}

/*
 * UPDATE TRANSACTION
 */
export function updateTransaction(
  updatedTransaction
) {
  const transactions =
    getTransactions()

  const updatedTransactions =
    transactions.map(
      (transaction) =>
        transaction.id ===
        updatedTransaction.id
          ? updatedTransaction
          : transaction
    )

  saveTransactionsLocally(
    updatedTransactions
  )

  const cloudTransaction =
    getCloudTransaction(
      updatedTransaction.id
    )

  if (cloudTransaction) {
    setDoc(
      cloudTransaction,
      updatedTransaction
    ).catch((error) => {
      console.error(
        'Unable to update transaction in cloud:',
        error
      )
    })
  }

  return updatedTransactions
}

/*
 * DELETE TRANSACTION
 */
export function deleteTransaction(
  transactionId
) {
  const transactions =
    getTransactions()

  const updatedTransactions =
    transactions.filter(
      (transaction) =>
        transaction.id !==
        transactionId
    )

  saveTransactionsLocally(
    updatedTransactions
  )

  const cloudTransaction =
    getCloudTransaction(
      transactionId
    )

  if (cloudTransaction) {
    deleteDoc(
      cloudTransaction
    ).catch((error) => {
      console.error(
        'Unable to delete transaction from cloud:',
        error
      )
    })
  }

  return updatedTransactions
}

export function clearTransactions() {
  localStorage.removeItem(
    STORAGE_KEY
  )
}

/*
 * CHECK WHETHER CLOUD ALREADY
 * CONTAINS TRANSACTIONS
 */
export async function getCloudStatus() {
  const cloudCollection =
    getCloudCollection()

  if (!cloudCollection) {
    return {
      loggedIn: false,
      cloudCount: 0,
      localCount:
        getTransactions().length,
      needsMigration: false,
    }
  }

  const snapshot =
    await getDocs(
      cloudCollection
    )

  const cloudCount =
    snapshot.size

  const localCount =
    getTransactions().length

  const cloudReady =
    localStorage.getItem(
      CLOUD_READY_KEY
    ) === 'true'

  return {
    loggedIn: true,
    cloudCount,
    localCount,

    needsMigration:
      localCount > 0 &&
      cloudCount === 0 &&
      !cloudReady,
  }
}

/*
 * ONE-TIME MIGRATION
 *
 * Uploads existing Local Storage
 * transactions into Firestore.
 */
export async function migrateLocalToCloud() {
  const transactions =
    getTransactions()

  const cloudCollection =
    getCloudCollection()

  if (!cloudCollection) {
    throw new Error(
      'Please sign in first.'
    )
  }

  for (
    const transaction
    of transactions
  ) {
    const transactionRef =
      doc(
        cloudCollection,
        String(
          transaction.id
        )
      )

    await setDoc(
      transactionRef,
      transaction
    )
  }

  localStorage.setItem(
    CLOUD_READY_KEY,
    'true'
  )

  return transactions.length
}

/*
 * LOAD CLOUD DATA INTO
 * LOCAL STORAGE
 */
export async function loadCloudTransactions() {
  const cloudCollection =
    getCloudCollection()

  if (!cloudCollection) {
    return []
  }

  const snapshot =
    await getDocs(
      cloudCollection
    )

  const cloudTransactions =
    snapshot.docs.map(
      (document) =>
        document.data()
    )

  /*
   * Only overwrite local data
   * when cloud has records,
   * or this device has already
   * been cloud-initialized.
   *
   * This protects old Local Storage
   * before migration.
   */
  const cloudReady =
    localStorage.getItem(
      CLOUD_READY_KEY
    ) === 'true'

  if (
    cloudTransactions.length > 0 ||
    cloudReady ||
    getTransactions().length === 0
  ) {
    saveTransactionsLocally(
      cloudTransactions
    )

    localStorage.setItem(
      CLOUD_READY_KEY,
      'true'
    )
  }

  return cloudTransactions
}

/*
 * REAL-TIME CLOUD SYNC
 *
 * Called from App.jsx.
 */
export function subscribeToCloudTransactions(
  onChange
) {
  const cloudCollection =
    getCloudCollection()

  if (!cloudCollection) {
    return () => {}
  }

  return onSnapshot(
    cloudCollection,

    (snapshot) => {
      const transactions =
        snapshot.docs.map(
          (document) =>
            document.data()
        )

      const cloudReady =
        localStorage.getItem(
          CLOUD_READY_KEY
        ) === 'true'

      const localTransactions =
        getTransactions()

      /*
       * Critical migration protection:
       *
       * If Firestore is empty but
       * this device still has old
       * Local Storage data, don't
       * wipe those records.
       */
      if (
        transactions.length === 0 &&
        localTransactions.length > 0 &&
        !cloudReady
      ) {
        return
      }

      saveTransactionsLocally(
        transactions
      )

      localStorage.setItem(
        CLOUD_READY_KEY,
        'true'
      )

      onChange?.(
        transactions
      )
    },

    (error) => {
      console.error(
        'Cloud sync error:',
        error
      )
    }
  )
}