import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'

import {
  auth,
  db,
} from '../firebase/firebase'

const CONTACTS_STORAGE_KEY =
  'krishiBookContacts'

export function getContacts() {
  const stored =
    localStorage.getItem(
      CONTACTS_STORAGE_KEY
    )

  if (!stored) {
    return []
  }

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error(
      'Unable to read contacts:',
      error
    )

    return []
  }
}

function saveContactsLocally(
  contacts
) {
  localStorage.setItem(
    CONTACTS_STORAGE_KEY,
    JSON.stringify(contacts)
  )
}

function getCloudContactsCollection() {
  const user =
    auth.currentUser

  if (!user) {
    return null
  }

  return collection(
    db,
    'users',
    user.uid,
    'contacts'
  )
}

function getCloudContact(
  contactId
) {
  const user =
    auth.currentUser

  if (!user) {
    return null
  }

  return doc(
    db,
    'users',
    user.uid,
    'contacts',
    String(contactId)
  )
}

export function saveContact(
  contact
) {
  const contacts =
    getContacts()

  const updatedContacts = [
    ...contacts.filter(
      (item) =>
        item.id !== contact.id
    ),
    contact,
  ]

  saveContactsLocally(
    updatedContacts
  )

  const cloudContact =
    getCloudContact(
      contact.id
    )

  if (cloudContact) {
    setDoc(
      cloudContact,
      contact
    ).catch((error) => {
      console.error(
        'Unable to save contact to cloud:',
        error
      )
    })
  }

  return updatedContacts
}

export function updateContact(
  updatedContact
) {
  const contacts =
    getContacts()

  const updatedContacts =
    contacts.map(
      (contact) =>
        contact.id ===
        updatedContact.id
          ? updatedContact
          : contact
    )

  saveContactsLocally(
    updatedContacts
  )

  const cloudContact =
    getCloudContact(
      updatedContact.id
    )

  if (cloudContact) {
    setDoc(
      cloudContact,
      updatedContact
    ).catch((error) => {
      console.error(
        'Unable to update contact in cloud:',
        error
      )
    })
  }

  return updatedContacts
}

export function deleteContact(
  contactId
) {
  const contacts =
    getContacts()

  const updatedContacts =
    contacts.filter(
      (contact) =>
        contact.id !==
        contactId
    )

  saveContactsLocally(
    updatedContacts
  )

  const cloudContact =
    getCloudContact(
      contactId
    )

  if (cloudContact) {
    deleteDoc(
      cloudContact
    ).catch((error) => {
      console.error(
        'Unable to delete contact from cloud:',
        error
      )
    })
  }

  return updatedContacts
}

export async function loadCloudContacts() {
  const cloudCollection =
    getCloudContactsCollection()

  if (!cloudCollection) {
    return getContacts()
  }

  const snapshot =
    await getDocs(
      cloudCollection
    )

  const cloudContacts =
    snapshot.docs.map(
      (contactDocument) =>
        contactDocument.data()
    )

  saveContactsLocally(
    cloudContacts
  )

  return cloudContacts
}

export function subscribeToCloudContacts(
  onChange
) {
  const cloudCollection =
    getCloudContactsCollection()

  if (!cloudCollection) {
    return () => {}
  }

  return onSnapshot(
    cloudCollection,
    (snapshot) => {
      const cloudContacts =
        snapshot.docs.map(
          (contactDocument) =>
            contactDocument.data()
        )

      saveContactsLocally(
        cloudContacts
      )

      if (onChange) {
        onChange(
          cloudContacts
        )
      }
    },
    (error) => {
      console.error(
        'Unable to sync contacts:',
        error
      )
    }
  )
}