import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'

import {
  auth,
  db,
} from '../firebase/firebase'

import {
  getContactCategory,
} from '../data/contactCategories'

/*
 * --------------------------------
 * PUBLIC CONTACT ID
 * --------------------------------
 *
 * Each public contact belongs to
 * the user who shared it.
 *
 * Combining user ID + private
 * contact ID prevents collisions.
 */

function getPublicContactId(
  contactId
) {
  const user =
    auth.currentUser

  if (!user) {
    return null
  }

  return `${user.uid}_${contactId}`
}

/*
 * --------------------------------
 * APPROXIMATE LOCATION
 * --------------------------------
 *
 * Never publish the farmer's exact
 * farm coordinates.
 *
 * Two decimal places gives us the
 * general local area rather than
 * farm-level precision.
 */

function approximateCoordinate(
  value
) {
  return (
    Math.round(
      Number(value) * 100
    ) / 100
  )
}

/*
 * --------------------------------
 * NEW SERVICE AREA
 * --------------------------------
 *
 * Used only when the contact is
 * being shared publicly for the
 * first time.
 */

function buildNewServiceArea(
  farmLocation,
  roleId
) {
  if (
    farmLocation?.latitude ==
      null ||
    farmLocation?.longitude ==
      null
  ) {
    throw new Error(
      'Farm location is not available.'
    )
  }

  const category =
    getContactCategory(
      roleId
    )

  return {
    latitude:
      approximateCoordinate(
        farmLocation.latitude
      ),

    longitude:
      approximateCoordinate(
        farmLocation.longitude
      ),

    placeName:
      farmLocation.placeName ||
      'Farm area',

    radiusKm:
      category.publicRadiusKm ||
      15,

    source:
      'farm-default',
  }
}

/*
 * --------------------------------
 * EXISTING SERVICE AREA
 * --------------------------------
 *
 * Once a contact has been associated
 * with an area, that area stays with
 * the CONTACT.
 *
 * If the farmer later changes their
 * own farm location, editing this
 * contact must NOT move the contact.
 *
 * We only update the radius if the
 * contact category changes.
 */

function preserveServiceArea(
  serviceArea,
  roleId
) {
  if (
    !serviceArea ||
    serviceArea.latitude ==
      null ||
    serviceArea.longitude ==
      null
  ) {
    return null
  }

  const category =
    getContactCategory(
      roleId
    )

  return {
    ...serviceArea,

    radiusKm:
      category.publicRadiusKm ||
      serviceArea.radiusKm ||
      15,
  }
}

/*
 * --------------------------------
 * SAVE PUBLIC CONTACT
 * --------------------------------
 */

export async function savePublicContact(
  contact,
  farmLocation
) {
  const user =
    auth.currentUser

  if (!user) {
    throw new Error(
      'Please sign in first.'
    )
  }

  if (!contact?.id) {
    throw new Error(
      'Contact ID is missing.'
    )
  }

  if (!contact.phone?.trim()) {
    throw new Error(
      'A phone number is required before sharing a contact.'
    )
  }

  const category =
    getContactCategory(
      contact.roleId
    )

  const publicContactId =
    getPublicContactId(
      contact.id
    )

  const publicRef =
    doc(
      db,
      'publicContacts',
      publicContactId
    )

  /*
   * Check whether this contact was
   * already shared before.
   */
  const existingSnapshot =
    await getDoc(
      publicRef
    )

  const existingPublicContact =
    existingSnapshot.exists()
      ? existingSnapshot.data()
      : null

  /*
   * Service-area priority:
   *
   * 1. Existing public record
   * 2. Service area remembered in
   *    the private contact
   * 3. Current farm location
   *
   * This prevents contacts moving
   * when the user moves farms.
   */
  const serviceArea =
    preserveServiceArea(
      existingPublicContact
        ?.serviceArea,
      contact.roleId
    ) ||

    preserveServiceArea(
      contact
        ?.publicServiceArea,
      contact.roleId
    ) ||

    buildNewServiceArea(
      farmLocation,
      contact.roleId
    )

  /*
   * Only deliberately public-safe
   * information goes into this
   * collection.
   *
   * Private notes are NOT copied.
   */
  const publicContact = {
    id:
      publicContactId,

    sourceContactId:
      String(
        contact.id
      ),

    ownerUserId:
      user.uid,

    name:
      contact.name.trim(),

    phone:
      contact.phone.trim(),

    roleId:
      contact.roleId,

    categoryLabel:
      category.label,

    serviceArea,

    directoryVersion:
      1,

    createdAt:
      existingPublicContact
        ?.createdAt ||
      contact.createdAt ||
      new Date()
        .toISOString(),

    updatedAt:
      new Date()
        .toISOString(),
  }

  await setDoc(
    publicRef,
    publicContact
  )

  return publicContact
}

/*
 * --------------------------------
 * REMOVE PUBLIC CONTACT
 * --------------------------------
 *
 * A private-only contact may have
 * no public-directory document.
 *
 * We check first before trying to
 * delete it.
 *
 * This prevents Firestore permission
 * errors when:
 *
 * - saving a private-only contact
 * - deleting a private-only contact
 * - turning sharing off when no
 *   public record exists
 */

export async function removePublicContact(
  contactId
) {
  const user =
    auth.currentUser

  if (!user) {
    return false
  }

  const publicContactId =
    getPublicContactId(
      contactId
    )

  if (!publicContactId) {
    return false
  }

  const publicRef =
    doc(
      db,
      'publicContacts',
      publicContactId
    )

  /*
   * First check whether the public
   * document actually exists.
   */
  const snapshot =
    await getDoc(
      publicRef
    )

  /*
   * Nothing was ever shared.
   *
   * This is perfectly normal for
   * private-only contacts.
   */
  if (!snapshot.exists()) {
    return false
  }

  const publicContact =
    snapshot.data()

  /*
   * Extra safety:
   *
   * Only the person who originally
   * shared the contact should ever
   * attempt to delete this document.
   */
  if (
    publicContact.ownerUserId !==
    user.uid
  ) {
    throw new Error(
      'You cannot remove a public contact shared by another user.'
    )
  }

  await deleteDoc(
    publicRef
  )

  return true
}

/*
 * --------------------------------
 * DISTANCE
 * --------------------------------
 *
 * Haversine formula:
 *
 * Calculates straight-line distance
 * between two GPS points.
 */

function toRadians(
  degrees
) {
  return (
    Number(degrees) *
    Math.PI /
    180
  )
}

export function calculateDistanceKm(
  firstLatitude,
  firstLongitude,
  secondLatitude,
  secondLongitude
) {
  const earthRadiusKm =
    6371

  const latitudeDifference =
    toRadians(
      Number(secondLatitude) -
      Number(firstLatitude)
    )

  const longitudeDifference =
    toRadians(
      Number(secondLongitude) -
      Number(firstLongitude)
    )

  const firstLatitudeRadians =
    toRadians(
      firstLatitude
    )

  const secondLatitudeRadians =
    toRadians(
      secondLatitude
    )

  const a =
    Math.sin(
      latitudeDifference / 2
    ) ** 2 +

    Math.cos(
      firstLatitudeRadians
    ) *

    Math.cos(
      secondLatitudeRadians
    ) *

    Math.sin(
      longitudeDifference / 2
    ) ** 2

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(
        1 - a
      )
    )

  return (
    earthRadiusKm * c
  )
}

/*
 * --------------------------------
 * NEARBY PUBLIC CONTACTS
 * --------------------------------
 *
 * For the MVP we download public
 * contacts and perform the distance
 * calculation on the phone.
 *
 * Later this can be replaced by
 * geohash/server-side querying when
 * the directory becomes large.
 */

export async function getNearbyPublicContacts(
  farmLocation
) {
  if (
    farmLocation?.latitude ==
      null ||
    farmLocation?.longitude ==
      null
  ) {
    return []
  }

  const snapshot =
    await getDocs(
      collection(
        db,
        'publicContacts'
      )
    )

  const currentUserId =
    auth.currentUser?.uid

  const nearbyContacts =
    []

  snapshot.docs.forEach(
    (
      documentSnapshot
    ) => {
      const contact =
        documentSnapshot.data()

      const serviceArea =
        contact.serviceArea

      if (
        serviceArea?.latitude ==
          null ||
        serviceArea?.longitude ==
          null
      ) {
        return
      }

      const distanceKm =
        calculateDistanceKm(
          farmLocation.latitude,
          farmLocation.longitude,
          serviceArea.latitude,
          serviceArea.longitude
        )

      const radiusKm =
        Number(
          serviceArea.radiusKm ||
          15
        )

      /*
       * Only show this contact if
       * the user's CURRENT farm is
       * within that contact's saved
       * service area.
       */
      if (
        distanceKm <=
        radiusKm
      ) {
        nearbyContacts.push({
          ...contact,

          id:
            documentSnapshot.id,

          distanceKm,

          isMine:
            contact.ownerUserId ===
            currentUserId,
        })
      }
    }
  )

  /*
   * Nearest contacts first.
   */
  return nearbyContacts.sort(
    (
      first,
      second
    ) => {
      const distanceDifference =
        first.distanceKm -
        second.distanceKm

      if (
        Math.abs(
          distanceDifference
        ) > 0.1
      ) {
        return distanceDifference
      }

      return String(
        first.name
      ).localeCompare(
        String(
          second.name
        )
      )
    }
  )
}