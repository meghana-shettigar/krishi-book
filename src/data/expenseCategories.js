export const EXPENSE_CATEGORY_VERSION = 3

/*
 * Category V3
 *
 * Expense categories are now flat.
 *
 * There are no subcategories.
 * Whatever the farmer selects here
 * is the final category saved to
 * Firestore.
 */
export const EXPENSE_CATEGORIES = [
  {
    value: 'Labour',
    label: 'Labour',
  },

  {
    value:
      'Fertilizer / Chunna / Compost',
    label:
      'Fertilizer / Chunna / Compost',
  },

  {
    value: 'Pesticide',
    label: 'Pesticide',
  },

  {
    value: 'New Plants / Seeds',
    label: 'New Plants / Seeds',
  },

  {
    value: 'Other Crop Expense',
    label: 'Other Crop Expense',
  },

  {
    value:
      'Water / Pipe / Sprinkler / Borewell',
    label:
      'Water / Pipe / Sprinkler / Borewell',
  },

  {
    value:
      'Machine / Transport / Tools',
    label:
      'Machine / Transport / Tools',
  },

  {
    value:
      'Land / Boundary / Levelling',
    label:
      'Land / Boundary / Levelling',
  },

  {
    value: 'Other Expense',
    label: 'Other Expense',
  },
]

const FINAL_CATEGORIES =
  new Set(
    EXPENSE_CATEGORIES.map(
      (item) =>
        item.value
    )
  )

/*
 * Converts old V1 / V2 records
 * into the final flat V3 category.
 *
 * This allows old records to remain
 * readable and editable even before
 * every Firestore document has been
 * manually migrated.
 */
export function mapExpenseToV3(
  category,
  expenseType
) {
  if (!category) {
    return null
  }

  /*
   * Already using a final V3 category.
   */
  if (
    FINAL_CATEGORIES.has(
      category
    )
  ) {
    return {
      category,
    }
  }

  /*
   * --------------------------------
   * OLD LABOUR
   * --------------------------------
   *
   * Cleaning / Planting / General Work
   * are no longer categories.
   *
   * All become Labour.
   */
  if (
    category === 'Labour' ||
    category === 'Manual Labour'
  ) {
    return {
      category:
        'Labour',
    }
  }

  /*
   * --------------------------------
   * OLD CROP CATEGORY
   * --------------------------------
   */
  if (
    category === 'Crop'
  ) {
    const cropMap = {
      Fertilizer:
        'Fertilizer / Chunna / Compost',

      Chunna:
        'Fertilizer / Chunna / Compost',

      Compost:
        'Fertilizer / Chunna / Compost',

      'Fertilizer / Chunna / Compost':
        'Fertilizer / Chunna / Compost',

      Pesticide:
        'Pesticide',

      'New Plant':
        'New Plants / Seeds',

      'New Seeds':
        'New Plants / Seeds',

      'New Plants / Seeds':
        'New Plants / Seeds',

      Other:
        'Other Crop Expense',

      'Other Crop Expense':
        'Other Crop Expense',
    }

    const mappedCategory =
      cropMap[
        expenseType
      ]

    if (
      !mappedCategory
    ) {
      return null
    }

    return {
      category:
        mappedCategory,
    }
  }

  /*
   * --------------------------------
   * VERY OLD CROP VALUES
   * --------------------------------
   */

  if (
    category ===
      'Fertilizer' ||
    category ===
      'Chunna' ||
    category ===
      'Compost'
  ) {
    return {
      category:
        'Fertilizer / Chunna / Compost',
    }
  }

  if (
    category ===
    'New Plant'
  ) {
    return {
      category:
        'New Plants / Seeds',
    }
  }

  if (
    category ===
    'New Seeds'
  ) {
    return {
      category:
        'New Plants / Seeds',
    }
  }

  /*
   * --------------------------------
   * OLD SINGLE CATEGORIES
   * --------------------------------
   */

  if (
    category ===
    'Water'
  ) {
    return {
      category:
        'Water / Pipe / Sprinkler / Borewell',
    }
  }

  if (
    category ===
    'Equipment'
  ) {
    return {
      category:
        'Machine / Transport / Tools',
    }
  }

  if (
    category ===
    'Land'
  ) {
    return {
      category:
        'Land / Boundary / Levelling',
    }
  }

  if (
    category ===
      'Others' ||
    category ===
      'Other'
  ) {
    return {
      category:
        'Other Expense',
    }
  }

  return null
}