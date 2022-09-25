// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh8BdENJJoqtd2ZWPWvO78wZAJC_FhCng",
  authDomain: "dev-auth-e0483.firebaseapp.com",
  projectId: "dev-auth-e0483",
  storageBucket: "dev-auth-e0483.appspot.com",
  messagingSenderId: "138411002096",
  appId: "1:138411002096:web:a31491359174c6a84f9a35"
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore(fbApp)
export const storage = getStorage(fbApp)

// setup Database Document
export const createUserDocFromAuth = async (userAuth, additionalInfomation = {}) => {
  if (!userAuth.email) return
  const userDocRef = doc(db, 'users', userAuth.email)
  console.log('userDocRef: ', userDocRef)

  const userSnapshot = await getDoc(userDocRef)
  console.log('userSnapShot: ', userSnapshot)
  console.log('check exsistence', userSnapshot.exists())

  // save the doc
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth
    const createdAt = new Date()

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        additionalInfomation
      })
    } catch (error) {
      console.log('create doc error', error.message)
    }
  }

  return userDocRef
}

// save user info to database
export const saveUserInfo = async (firstName, familyName, phone, postcode, address = {}) => {
  const createTime = new Date().toISOString()
  const userInfoDocRef = doc(db, 'userInfo', createTime)
  try {
    await setDoc(userInfoDocRef, {
      firstName,
      familyName,
      phone,
      address,
      postcode
    })
  } catch (error) {
    console.log('create user info doc error', error.message)
  }
  console.log('userInfoDocRef.id', userInfoDocRef.id)
}

// signup with user Email
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return
  return await createUserWithEmailAndPassword(auth, email, password)
}

// login with user Email
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return
  return await signInWithEmailAndPassword(auth, email, password)
}


// get user info by email
export const getUserNameByUserEmail = async (email) => {
  const userDocRef = doc(db, 'users', email)
  const docSnap = await getDoc(userDocRef)
  if (docSnap.exists()) {
    console.log("username by email: ", docSnap.data())
    return docSnap.data().additionalInfomation.displayName
  } else {
    console.log("failed")
  }
}

// save avart to users
export const addAvatarUrl2UserDb = async (email, url) => {
  let avatarUrl = ''
  const avatarRef = ref(storage, `images/avatars/${email}-avatar`)
  try {
    await uploadBytes(avatarRef, url).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        avatarUrl = url
      })
    })
    console.log("succeed")
  } catch (error) {
    console.log("upload avatar failed", error.message)
  }
  return avatarUrl
}

// download avatar from Storage
export const getAvatarFromStorage = async (email) => {
  let avatarUrl = ''
  const avatarRef = ref(storage, `images/avatars/${email}-avatar`)
  await getDownloadURL(avatarRef).then((url) => {
    avatarUrl = url
  })
  return avatarUrl
}

// update username(displayname) in users
export const updateDisplayName = async (email, name) => {
  const userDocRef = doc(db, 'users', email)
  try {
    await updateDoc(userDocRef, {
      "displayName": name,
      "additionalInfomation.displayName": name
    })
  } catch (error) {
    console.log("update username error: ", error.message)
  }
}