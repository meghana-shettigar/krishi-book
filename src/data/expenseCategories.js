export const EXPENSE_CATEGORY_VERSION = 2

export const EXPENSE_CATEGORIES = [
  {
    value: 'Labour',
    label: 'Labour',
    options: [
      'Cleaning',
      'Planting',
      'General / Other Work',
    ],
  },

  {
    value: 'Crop',
    label: 'Crop',
    options: [
      'Fertilizer / Chunna / Compost',
      'Pesticide',
      'New Plants / Seeds',
      'Other Crop Expense',
    ],
  },

  {
    value:
      'Water / Pipe / Sprinkler / Borewell',
    label:
      'Water / Pipe / Sprinkler / Borewell',
    options: [],
  },

  {
    value:
      'Machine / Transport / Tools',
    label:
      'Machine / Transport / Tools',
    options: [],
  },

  {
    value:
      'Land / Boundary / Levelling',
    label:
      'Land / Boundary / Levelling',
    options: [],
  },

  {
    value: 'Other Expense',
    label: 'Other Expense',
    options: [],
  },
]

export function getExpenseCategoryDefinition(
  category
) {
  return EXPENSE_CATEGORIES.find(
    (item) =>
      item.value === category
  )
}

export function getExpenseOptions(
  category
) {
  return (
    getExpenseCategoryDefinition(
      category
    )?.options || []
  )
}

export function hasExpenseSubcategories(
  category
) {
  return (
    getExpenseOptions(
      category
    ).length > 0
  )
}

export function getDefaultExpenseType(
  category
) {
  if (!category) {
    return ''
  }

  if (
    hasExpenseSubcategories(
      category
    )
  ) {
    return ''
  }

  return category
}

/*
 * Converts both old and new
 * classifications to Category V2.
 *
 * Returns null only when we find
 * something we don't recognise.
 * That protects the migration from
 * silently changing unknown data.
 */
export function mapExpenseToV2(
  category,
  expenseType
) {
  if (!category) {
    return null
  }

  /*
   * Already-new single-level categories
   */
  if (
    category ===
      'Water / Pipe / Sprinkler / Borewell' ||
    category ===
      'Machine / Transport / Tools' ||
    category ===
      'Land / Boundary / Levelling' ||
    category ===
      'Other Expense'
  ) {
    return {
      category,
      expenseType: category,
    }
  }

  /*
   * LABOUR
   */
  if (
    category === 'Manual Labour' ||
    category === 'Labour'
  ) {
    const labourMap = {
      Cleaning: 'Cleaning',

      Planting: 'Planting',

      'General farm work':
        'General / Other Work',

      'General / Other Work':
        'General / Other Work',

      Harvesting:
        'General / Other Work',

      Other:
        'General / Other Work',
    }

    const mappedType =
      labourMap[expenseType]

    if (!mappedType) {
      return null
    }

    return {
      category: 'Labour',
      expenseType:
        mappedType,
    }
  }

  /*
   * CROP
   */
  if (category === 'Crop') {
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

    const mappedType =
      cropMap[expenseType]

    if (!mappedType) {
      return null
    }

    return {
      category: 'Crop',
      expenseType:
        mappedType,
    }
  }

  /*
   * OLD WATER
   */
  if (category === 'Water') {
    return {
      category:
        'Water / Pipe / Sprinkler / Borewell',

      expenseType:
        'Water / Pipe / Sprinkler / Borewell',
    }
  }

  /*
   * OLD EQUIPMENT
   */
  if (
    category === 'Equipment'
  ) {
    return {
      category:
        'Machine / Transport / Tools',

      expenseType:
        'Machine / Transport / Tools',
    }
  }

  /*
   * OLD LAND
   */
  if (category === 'Land') {
    return {
      category:
        'Land / Boundary / Levelling',

      expenseType:
        'Land / Boundary / Levelling',
    }
  }

  /*
   * OLD OTHER
   */
  if (
    category === 'Others'
  ) {
    return {
      category:
        'Other Expense',

      expenseType:
        'Other Expense',
    }
  }

  return null
}