export const CONTACT_CATEGORIES = [
  {
    id: 'farm-labour',
    label: 'Farm Labour',
    icon: '👷',
    description:
      'Workers, cleaning, planting and other farm work',

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
    label: 'Black Pepper Buyer',
    icon: '🌿',
    description:
      'Person who buys black pepper',

    publicRadiusKm: 25,

    /*
     * Internal value remains Pepper.
     */
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

  {
    id: 'crop-supplies',
    label:
      'Fertiliser / Chunna / Compost / Pesticide',
    icon: '🧪',
    description:
      'Fertiliser, chunna, compost and pesticide supplier',

    publicRadiusKm: 15,

    /*
     * This contact category covers
     * multiple final expense categories,
     * so don't guess which one.
     */
    ledgerDefaults: {
      type: 'expense',
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

      category:
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
    },
  },

  {
    id: 'government-agriculture',
    label:
      'Government / Agriculture Office',
    icon: '🏢',
    description:
      'Agriculture, horticulture or government benefit contact',

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
        category.id ===
        roleId
    ) ||
    CONTACT_CATEGORIES[
      CONTACT_CATEGORIES.length -
        1
    ]
  )
}