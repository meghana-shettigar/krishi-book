import {
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore'

import {
  auth,
  db,
} from '../firebase/firebase'

import {
  loadCloudTransactions,
} from './storage'

import {
  EXPENSE_CATEGORY_VERSION,
  mapExpenseToV2,
} from '../data/expenseCategories'

async function buildMigrationPlan() {
  const user =
    auth.currentUser

  if (!user) {
    throw new Error(
      'Please sign in to Krishi Book first.'
    )
  }

  const transactionCollection =
    collection(
      db,
      'users',
      user.uid,
      'transactions'
    )

  const snapshot =
    await getDocs(
      transactionCollection
    )

  const changes = []
  const unknown = []

  snapshot.docs.forEach(
    (documentSnapshot) => {
      const transaction =
        documentSnapshot.data()

      /*
       * Income records are not part of
       * this taxonomy migration.
       */
      if (
        transaction.type !==
        'expense'
      ) {
        return
      }

      /*
       * Already migrated.
       */
      if (
        transaction.categoryVersion ===
        EXPENSE_CATEGORY_VERSION
      ) {
        return
      }

      const mapped =
        mapExpenseToV2(
          transaction.category,
          transaction.expenseType
        )

      /*
       * Never guess if we encounter
       * a value we don't know about.
       */
      if (!mapped) {
        unknown.push({
          id:
            documentSnapshot.id,

          category:
            transaction.category,

          expenseType:
            transaction.expenseType,

          amount:
            transaction.amount,
        })

        return
      }

      const updateData = {
        category:
          mapped.category,

        expenseType:
          mapped.expenseType,

        categoryVersion:
          EXPENSE_CATEGORY_VERSION,
      }

      /*
       * Preserve the original values.
       * If legacy data already exists,
       * never overwrite it.
       */
      if (
        transaction.legacyCategory ===
        undefined
      ) {
        updateData.legacyCategory =
          transaction.category ??
          null
      }

      if (
        transaction.legacyExpenseType ===
        undefined
      ) {
        updateData.legacyExpenseType =
          transaction.expenseType ??
          null
      }

      changes.push({
        ref:
          documentSnapshot.ref,

        id:
          documentSnapshot.id,

        oldCategory:
          transaction.category,

        oldExpenseType:
          transaction.expenseType,

        newCategory:
          mapped.category,

        newExpenseType:
          mapped.expenseType,

        amount:
          transaction.amount,

        updateData,
      })
    }
  )

  return {
    changes,
    unknown,
  }
}

/*
 * SAFE PREVIEW.
 *
 * Does NOT write anything.
 */
export async function previewExpenseCategoryMigration() {
  const {
    changes,
    unknown,
  } =
    await buildMigrationPlan()

  console.log(
    `Expense records ready to migrate: ${changes.length}`
  )

  console.table(
    changes.map(
      (item) => ({
        id:
          item.id,

        fromCategory:
          item.oldCategory,

        fromType:
          item.oldExpenseType,

        toCategory:
          item.newCategory,

        toType:
          item.newExpenseType,

        amount:
          item.amount,
      })
    )
  )

  if (
    unknown.length > 0
  ) {
    console.warn(
      'STOP: Some expense classifications were not recognised.'
    )

    console.table(
      unknown
    )
  } else {
    console.log(
      '✓ All expense categories are recognised.'
    )
  }

  return {
    changeCount:
      changes.length,

    unknownCount:
      unknown.length,

    changes:
      changes.map(
        (item) => ({
          id:
            item.id,

          from:
            `${item.oldCategory} → ${item.oldExpenseType}`,

          to:
            `${item.newCategory} → ${item.newExpenseType}`,

          amount:
            item.amount,
        })
      ),

    unknown,
  }
}

/*
 * ACTUAL MIGRATION.
 *
 * Will refuse to run if even one
 * unrecognised classification exists.
 */
export async function migrateExpenseCategoriesToV2() {
  const {
    changes,
    unknown,
  } =
    await buildMigrationPlan()

  if (
    unknown.length > 0
  ) {
    console.table(
      unknown
    )

    throw new Error(
      'Migration stopped because some expense categories are not recognised.'
    )
  }

  if (
    changes.length === 0
  ) {
    console.log(
      'Nothing to migrate. Expense categories are already on Version 2.'
    )

    return {
      migrated: 0,
    }
  }

  /*
   * Firestore batch limit is 500.
   * Use smaller chunks for safety.
   */
  const chunkSize = 400

  for (
    let start = 0;
    start < changes.length;
    start += chunkSize
  ) {
    const chunk =
      changes.slice(
        start,
        start + chunkSize
      )

    const batch =
      writeBatch(db)

    chunk.forEach(
      (item) => {
        batch.update(
          item.ref,
          item.updateData
        )
      }
    )

    await batch.commit()
  }

  /*
   * Refresh localStorage so this
   * browser immediately sees exactly
   * what is now stored in Firestore.
   */
  await loadCloudTransactions()

  console.log(
    `✓ Successfully migrated ${changes.length} expense records to Category Version 2.`
  )

  return {
    migrated:
      changes.length,
  }
}