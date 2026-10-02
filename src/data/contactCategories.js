export const CONTACT_CATEGORIES = [
  {
    id: 'farm-labour',
    label: 'Farm Labour',
    icon: '👷',
    description:
      'Workers, cleaning, planting and other farm work',

    /*
     * Automatic public-directory
     * service radius.
     *
     * The farmer never needs to
     * choose or understand this.
     */
    publicRadiusKm: 15,

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

    publicRadiusKm: 20,

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

    publicRadiusKm: 30,

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

    publicRadiusKm: 25,

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

    publicRadiusKm: 15,

    ledgerDefaults: {
      type: 'income',
      incomeType: 'Sold',
      crop: 'Vegetable',
    },
  },

  /*
   * Keep the old ID "crop-supplies"
   * so existing contacts continue
   * to work.
   */
  {
    id: 'crop-supplies',
    label:
      'Fertiliser / Chunna / Compost / Pesticide',
    icon: '🧪',
    description:
      'Fertiliser, chunna, compost and pesticide supplier',

    publicRadiusKm: 15,

    ledgerDefaults: {
      type: 'expense',
      category: 'Crop',
    },
  },

  {
    id: 'nursery',
    label: 'Nursery',
    icon: '🪴',
    description:
      'New plants, saplings and seeds',

    publicRadiusKm: 25,

    ledgerDefaults: {
      type: 'expense',
      category: 'Crop',
      expenseType:
        'New Plants / Seeds',
    },
  },

  {
    id: 'water-service',
    label:
      'Pipe / Sprinkler / Water',
    icon: '💧',
    description:
      'Pipe, sprinkler, pump, tank and other water work',

    publicRadiusKm: 20,

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

    publicRadiusKm: 40,

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

    publicRadiusKm: 25,

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

    publicRadiusKm: 25,

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

    /*
     * For government offices this
     * represents a discovery area,
     * rather than how far an officer
     * personally travels.
     */
    publicRadiusKm: 30,

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

    publicRadiusKm: 15,

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