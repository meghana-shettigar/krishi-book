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

function normalizeProfileLanguage(
  language
) {
  return language === 'kn'
    ? 'kn'
    : 'en'
}

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

  if (!snapshot.exists()) {
    const profile = {
      email:
        firebaseUser.email ||
        '',

      language:
        normalizeProfileLanguage(
          initialProfile.language
        ),

      farmLocation:
        null,

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

    await setDoc(
      profileRef,
      profile,
      {
        merge: true,
      }
    )
  } else {
    const existing =
      snapshot.data() ||
      {}

    const updates = {}

    if (
      initialProfile
        .name
        ?.trim() &&
      !existing.name
    ) {
      updates.name =
        initialProfile
          .name
          .trim()
    }

    /*
     * Important for new-account race:
     *
     * App.jsx may create the profile
     * milliseconds before Login.jsx
     * finishes account creation.
     */
    if (
      initialProfile.language
    ) {
      const requestedLanguage =
        normalizeProfileLanguage(
          initialProfile.language
        )

      if (
        existing.language !==
        requestedLanguage
      ) {
        updates.language =
          requestedLanguage
      }
    }

    if (
      Object.keys(
        updates
      ).length > 0
    ) {
      await setDoc(
        profileRef,
        {
          ...updates,

          updatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      )
    }
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
 * Save account language.
 *
 * This changes only presentation.
 * Transactions and contacts are
 * never rewritten.
 */
export async function saveLanguage(
  language
) {
  const user =
    auth.currentUser

  if (!user) {
    throw new Error(
      'Please sign in first.'
    )
  }

  const normalized =
    normalizeProfileLanguage(
      language
    )

  await setDoc(
    getProfileRef(
      user.uid
    ),
    {
      language:
        normalized,

      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  )

  return getUserProfile(
    user.uid
  )
}

/*
 * Save confirmed farm location.
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

        confirmed:
          true,
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

  localStorage.removeItem(
    'krishiBookFarmWeatherV1'
  )

  return getUserProfile(
    user.uid
  )
}