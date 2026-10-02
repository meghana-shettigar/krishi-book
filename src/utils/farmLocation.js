/*
 * Ask the browser/phone for the
 * user's current physical location.
 */
export function getCurrentDeviceLocation() {
  return new Promise(
    (resolve, reject) => {
      if (
        !navigator.geolocation
      ) {
        reject(
          new Error(
            'Location is not supported on this device.'
          )
        )

        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude:
              position
                .coords
                .latitude,

            longitude:
              position
                .coords
                .longitude,
          })
        },

        (error) => {
          if (
            error.code === 1
          ) {
            reject(
              new Error(
                'Location permission is turned off. Please allow location access and try again.'
              )
            )

            return
          }

          if (
            error.code === 2
          ) {
            reject(
              new Error(
                'Your phone could not find the location. Please move somewhere with a better signal and try again.'
              )
            )

            return
          }

          if (
            error.code === 3
          ) {
            reject(
              new Error(
                'Finding the location took too long. Please try again.'
              )
            )

            return
          }

          reject(
            new Error(
              'Unable to find your location. Please try again.'
            )
          )
        },

        {
          enableHighAccuracy:
            true,

          timeout:
            15000,

          maximumAge: 0,
        }
      )
    }
  )
}

/*
 * Turn:
 *
 * 13.025216, 74.914916
 *
 * into something useful such as:
 *
 * Muchur, Karnataka
 *
 * Coordinates are never shown
 * to the normal user interface.
 */
export async function reverseGeocodeFarmLocation(
  latitude,
  longitude
) {
  const url =
    new URL(
      'https://nominatim.openstreetmap.org/reverse'
    )

  url.searchParams.set(
    'format',
    'jsonv2'
  )

  url.searchParams.set(
    'lat',
    String(latitude)
  )

  url.searchParams.set(
    'lon',
    String(longitude)
  )

  url.searchParams.set(
    'zoom',
    '14'
  )

  url.searchParams.set(
    'addressdetails',
    '1'
  )

  url.searchParams.set(
    'accept-language',
    'en'
  )

  const response =
    await fetch(
      url.toString(),
      {
        headers: {
          Accept:
            'application/json',
        },
      }
    )

  if (!response.ok) {
    throw new Error(
      'Unable to find the place name.'
    )
  }

  const result =
    await response.json()

  const address =
    result.address || {}

  /*
   * Different places may be returned
   * as village, hamlet, town, city,
   * suburb, etc.
   */
  const place =
    address.village ||
    address.hamlet ||
    address.town ||
    address.city ||
    address.suburb ||
    address.municipality ||
    address.county ||
    ''

  const state =
    address.state ||
    address.state_district ||
    ''

  let placeName =
    ''

  if (
    place &&
    state &&
    place !== state
  ) {
    placeName =
      `${place}, ${state}`
  } else {
    placeName =
      place ||
      state ||
      ''
  }

  if (!placeName) {
    throw new Error(
      'Unable to find the place name.'
    )
  }

  return {
    latitude,
    longitude,
    placeName,
  }
}