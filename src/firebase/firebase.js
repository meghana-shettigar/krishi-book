import { initializeApp } from 'firebase/app'

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'

import {
  getFirestore,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyALBcC0Q5k0umF1uSLqzI4_W_ffipmuUDo',
  authDomain: 'krishi-book.firebaseapp.com',
  projectId: 'krishi-book',
  storageBucket: 'krishi-book.firebasestorage.app',
  messagingSenderId: '984097909849',
  appId: '1:984097909849:web:a76f2121b74c26bf92d548',
}

const app = initializeApp(firebaseConfig)

/*
 * Firebase Authentication
 */
export const auth = getAuth(app)

/*
 * Firestore Database
 */
export const db = getFirestore(app)

/*
 * Keep the user signed in on this device.
 */
setPersistence(
  auth,
  browserLocalPersistence
).catch((error) => {
  console.error(
    'Unable to persist Firebase login:',
    error
  )
})