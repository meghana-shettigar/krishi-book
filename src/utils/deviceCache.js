const LAST_USER_KEY =
  'krishiBookLastAuthUser'

/*
 * These are only temporary
 * device/browser caches.
 *
 * Firestore remains the main
 * cloud copy of the data.
 */
const FARM_CACHE_KEYS = [
  'krishiBookTransactions',
  'krishiBookContacts',
  'krishiBookCloudReady',
  'krishiBookFarmWeatherV1',
]

export function clearFarmDeviceCache() {
  FARM_CACHE_KEYS.forEach(
    (key) => {
      localStorage.removeItem(
        key
      )
    }
  )
}

/*
 * Called whenever Firebase tells
 * us who is signed in.
 *
 * If this phone/browser changes
 * from one Firebase account to
 * another, remove the old person's
 * temporary cached farm data.
 */
export function prepareDeviceForUser(
  userId
) {
  if (!userId) {
    return
  }

  const previousUserId =
    localStorage.getItem(
      LAST_USER_KEY
    )

  if (
    previousUserId &&
    previousUserId !==
      userId
  ) {
    clearFarmDeviceCache()
  }

  localStorage.setItem(
    LAST_USER_KEY,
    userId
  )
}