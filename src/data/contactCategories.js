export const CONTACT_CATEGORIES = [
  {
    id: 'farm-labour',
    label: 'Farm Labour',
    icon: '👷',
    description:
      'Workers, cleaning, planting and other farm work',
    ledgerDefaults: {
      type: 'expense',
      category: 'Labour',
    },
  },

  {
    id: 'coconut-buyer',
    label: 'Coconut Buyer',
    icon: '🥥',
    description:
      'Person who buys coconuts',
    ledgerDefaults: {
      type: 'income',
      incomeType: 'Sold',
      crop: 'Coconut',
    },
  },

  {
    id: 'supari-buyer',
    label: 'Supari Buyer',
    icon: '🌰',
    description:
      'Person who buys supari / arecanut',
    ledgerDefaults: {
      type: 'income',
      incomeType: 'Sold',
      crop: 'Supari',
    },
  },

  {
    id: 'pepper-buyer',
    label: 'Pepper Buyer',
    icon: '🌿',
    description:
      'Person who buys pepper',
    ledgerDefaults: {
      type: 'income',
      incomeType: 'Sold',
      crop: 'Pepper',
    },
  },

  {
    id: 'vegetable-buyer',
    label: 'Vegetable Buyer',
    icon: '🥬',
    description:
      'Person who buys vegetables',
    ledgerDefaults: {
      type: 'income',
      incomeType: 'Sold',
      crop: 'Vegetable',
    },
  },

  /*
   * Keep the old ID "crop-supplies".
   *
   * This means any existing contact
   * previously saved as Farm Supplies
   * automatically uses this new label.
   *
   * We do NOT set expenseType here
   * because this contact might supply
   * fertilizer, chunna, compost OR
   * pesticide.
   */
  {
    id: 'crop-supplies',
    label:
      'Fertiliser / Chunna / Compost / Pesticide',
    icon: '🧪',
    description:
      'Fertiliser, chunna, compost and pesticide supplier',
    ledgerDefaults: {
      type: 'expense',
      category: 'Crop',
    },
  },

  /*
   * Nursery is more specific.
   *
   * Since New Plants and New Seeds
   * have already been merged into
   * "New Plants / Seeds", this role
   * can safely pre-fill both category
   * and expenseType.
   */
  {
    id: 'nursery',
    label: 'Nursery',
    icon: '🪴',
    description:
      'New plants, saplings and seeds',
    ledgerDefaults: {
      type: 'expense',
      category: 'Crop',
      expenseType:
        'New Plants / Seeds',
    },
  },

  /*
   * Pipe / sprinkler / water contacts
   * remain separate from Borewell.
   */
  {
    id: 'water-service',
    label:
      'Pipe / Sprinkler / Water',
    icon: '💧',
    description:
      'Pipe, sprinkler, pump, tank and other water work',
    ledgerDefaults: {
      type: 'expense',

      category:
        'Water / Pipe / Sprinkler / Borewell',

      expenseType:
        'Water / Pipe / Sprinkler / Borewell',
    },
  },

  /*
   * Borewell is a separate Contact Book
   * category because it may be handled
   * by a completely different person.
   *
   * It still goes to the same Expense
   * category in the ledger.
   */
  {
    id: 'borewell-service',
    label: 'Borewell',
    icon: '💧',
    description:
      'Borewell drilling or borewell service',
    ledgerDefaults: {
      type: 'expense',

      category:
        'Water / Pipe / Sprinkler / Borewell',

      expenseType:
        'Water / Pipe / Sprinkler / Borewell',
    },
  },

  {
    id: 'equipment-service',
    label:
      'Machine / Transport / Tools',
    icon: '🚜',
    description:
      'Tractor, machine, vehicle, transport or tools',
    ledgerDefaults: {
      type: 'expense',

      category:
        'Machine / Transport / Tools',

      expenseType:
        'Machine / Transport / Tools',
    },
  },

  {
    id: 'land-service',
    label:
      'Land / Boundary / Levelling',
    icon: '🌱',
    description:
      'Land work, fencing, boundary, road or drainage',
    ledgerDefaults: {
      type: 'expense',

      category:
        'Land / Boundary / Levelling',

      expenseType:
        'Land / Boundary / Levelling',
    },
  },

  {
    id: 'government-agriculture',
    label:
      'Government / Agriculture Office',
    icon: '🏢',
    description:
      'Agriculture, horticulture or government benefit contact',
    ledgerDefaults: {
      type: 'income',

      incomeType:
        'Agricultural benefit',

      crop:
        'Agricultural benefit',
    },
  },

  {
    id: 'other',
    label:
      'Other Farm Contact',
    icon: '👤',
    description:
      'Any other farm-related person or service',
    ledgerDefaults: {},
  },
]

export function getContactCategory(
  roleId
) {
  return (
    CONTACT_CATEGORIES.find(
      (category) =>
        category.id === roleId
    ) ||
    CONTACT_CATEGORIES[
      CONTACT_CATEGORIES.length -
        1
    ]
  )
}