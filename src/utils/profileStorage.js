import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import {
  auth,
  db,
} from '../firebase/firebase'

function getProfileRef(
  userId
) {
  if (!userId) {
    return null
  }

  return doc(
    db,
    'users',
    userId
  )
}

/*
 * Create the top-level user profile
 * if it does not already exist.
 *
 * Existing parents' transactions and
 * contacts are completely untouched.
 */
export async function ensureUserProfile(
  firebaseUser,
  initialProfile = {}
) {
  if (!firebaseUser) {
    return null
  }

  const profileRef =
    getProfileRef(
      firebaseUser.uid
    )

  const snapshot =
    await getDoc(
      profileRef
    )

  /*
   * Existing account without
   * a profile document.
   *
   * This will happen once for your
   * parents because their account
   * existed before profiles did.
   */
  if (!snapshot.exists()) {
    const profile = {
      email:
        firebaseUser.email ||
        '',

      language: 'en',

      farmLocation: null,

      onboardingComplete:
        false,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    }

    if (
      initialProfile
        .name
        ?.trim()
    ) {
      profile.name =
        initialProfile
          .name
          .trim()
    }

    /*
     * merge:true is important.
     *
     * users/{uid} may already have
     * transaction/contact
     * subcollections.
     */
    await setDoc(
      profileRef,
      profile,
      {
        merge: true,
      }
    )
  } else if (
    initialProfile
      .name
      ?.trim() &&
    !snapshot.data()?.name
  ) {
    /*
     * Handles a newly-created account
     * where the authentication listener
     * and signup process happen nearly
     * at the same time.
     */
    await setDoc(
      profileRef,
      {
        name:
          initialProfile
            .name
            .trim(),

        updatedAt:
          serverTimestamp(),
      },
      {
        merge: true,
      }
    )
  }

  return getUserProfile(
    firebaseUser.uid
  )
}

export async function getUserProfile(
  userId =
    auth.currentUser?.uid
) {
  if (!userId) {
    return null
  }

  const profileRef =
    getProfileRef(
      userId
    )

  const snapshot =
    await getDoc(
      profileRef
    )

  if (!snapshot.exists()) {
    return null
  }

  return {
    id:
      snapshot.id,

    ...snapshot.data(),
  }
}

/*
 * Save the confirmed farm location.
 */
export async function saveFarmLocation(
  farmLocation
) {
  const user =
    auth.currentUser

  if (!user) {
    throw new Error(
      'Please sign in first.'
    )
  }

  const profileRef =
    getProfileRef(
      user.uid
    )

  await setDoc(
    profileRef,
    {
      farmLocation: {
        latitude:
          farmLocation.latitude,

        longitude:
          farmLocation.longitude,

        placeName:
          farmLocation.placeName,

        locationSource:
          'device',

        confirmed: true,
      },

      onboardingComplete:
        true,

      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  )

  /*
   * The old weather forecast may
   * belong to the previous location.
   */
  localStorage.removeItem(
    'krishiBookFarmWeatherV1'
  )

  return getUserProfile(
    user.uid
  )
}