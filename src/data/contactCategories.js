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

  {
    id: 'crop-supplies',
    label: 'Farm Supplies',
    icon: '🧪',
    description:
      'Fertilizer, chunna, pesticide, plants, seeds or compost',
    ledgerDefaults: {
      type: 'expense',
      category: 'Crop',
    },
  },

  /*
   * Kept separate from Borewell because
   * these may be handled by different people.
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
        category.id ===
        roleId
    ) ||
    CONTACT_CATEGORIES[
      CONTACT_CATEGORIES.length -
        1
    ]
  )
}