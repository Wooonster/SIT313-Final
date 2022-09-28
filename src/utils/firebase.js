// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updatePassword } from "firebase/auth";
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, collection } from 'firebase/firestore'
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
  // console.log('userDocRef: ', userDocRef)

  const userSnapshot = await getDoc(userDocRef)
  // console.log('userSnapShot: ', userSnapshot)
  // console.log('check exsistence', userSnapshot.exists())

  // save the doc
  if (!userSnapshot.exists()) {
    let { displayName, email } = userAuth
    const createdAt = new Date()
    displayName = additionalInfomation.displayName
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
export const saveUserInfo = async (email, firstName, familyName, phone, postcode, address = {}) => {
  const createTime = new Date().toISOString()
  const userInfoDocRef = doc(db, 'userInfo', email)
  try {
    await setDoc(userInfoDocRef, {
      firstName,
      familyName,
      phone,
      address,
      postcode,
      createTime,
      email
    })
  } catch (error) {
    console.log('create user info doc error', error.message)
  }
  console.log('userInfoDocRef.id', userInfoDocRef.id)
}

// read user info from fb
export const readUserInfoByEmail = async (email) => {
  const userInfoDocRef = doc(db, 'userInfo', email)
  const docSnap = await getDoc(userInfoDocRef)

  if(docSnap.exists()) {
    // console.log('logged user info: ', docSnap.data())
    return docSnap.data()
  } else {
    console.log('user info not found')
  }
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


// signup with Google
const provider = new GoogleAuthProvider()
provider.setCustomParameters({
  prompt: 'select_account'
})
export const signInWithGoogle = () => signInWithPopup(auth, provider)
export const saveGoogleUser = async (email, displayName, createTime) => {
  const userDocRef = doc(db, 'users', email)
  try {
    await setDoc(userDocRef, {
      email,
      displayName,
      createTime
    })
  } catch (error) {
    console.log('create google user error', error.message)
  }
}

// get user info by email
export const getUserNameByUserEmail = async (email) => {
  const userDocRef = doc(db, 'users', email)
  const docSnap = await getDoc(userDocRef)
  if (docSnap.exists()) {
    console.log("username by email: ", docSnap.data())
    // return docSnap.data().additionalInfomation.displayName
    // if (docSnap.data().additionalInfomation.displayName === null) return docSnap.data().displayName
    // else return docSnap.data().additionalInfomation.displayName
    if (docSnap.data().displayName !== '') {
      // console.log("docSnap.data().displayName", docSnap.data().displayName)
      return docSnap.data().displayName
    } else {
      console.log('docSnap.data().additionalInfomation.displayName', docSnap.data().additionalInfomation.displayName)
      return docSnap.data().additionalInfomation.displayName
    }
  } else {
    console.log("failed")
  }
}

// save avart to users
export const addAvatarUrl2UserDb = async (email, url) => {
  let avatarUrl = ''
  const avatarRef = ref(storage, `images/${email}/avatars/${email}-avatar`)
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
  const avatarRef = ref(storage, `images/${email}/avatars/${email}-avatar`)
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

// update user password
export const updateUserPassword = async (email, pwd) => {
  // const userDocRef = doc(db, 'users', email)
  // try {
  //   await updateDoc(userDocRef, {
  //     "additionalInfomation.password": pwd
  //   })
  // } catch (error) {
  //   console.log("password upload failed")
  // }
  try {
    // updatePassword(auth, email, pwd)
    updatePassword(email, pwd)
    // updatePassword()
  } catch (error) {
    console.log('change pwd error', error)
  }
}

// save article
export const saveArticle2Fb = async (email, username, title, abstract, content, tags, addedPicture) => {
  const createTime = new Date().toISOString()
  const articleDocRef = doc(db, 'articles', createTime)
  try {
    await setDoc(articleDocRef, {
      email,
      username,
      title,
      abstract,
      content,
      tags
    })

    for (var i = 0; i < addedPicture.length; i++) {
      const pictureRef = ref(storage, `images/${email}/article/${title}-${i}`)
      await uploadBytes(pictureRef, addedPicture[i])
    }
  } catch (error) {
    console.log("save article error: ", error.message)
  }
}

// save question
export const saveQuestion2Fb = async (email, username, title, content, tags, addedPicture) => {
  const createTime = new Date().toISOString()
  const questionDocRef = doc(db, 'questions', createTime)

  try {
    await setDoc(questionDocRef, {
      email,
      username,
      createTime,
      title,
      content,
      tags
    })

    for (var i = 0; i < addedPicture.length; i++) {
      const pictureRef = ref(storage, `images/${email}/question/${title}-${i}`)
      await uploadBytes(pictureRef, addedPicture[i])
    }
  } catch (error) {
    console.log("save question error: ", error.message)
  }
  // console.log("addedPicture", addedPicture)
}

// read questions
export const readAllQuestions = async () => {
  const querySnapshot = await getDocs(collection(db, 'questions'))
  const allQuestion = []
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data())
    allQuestion.push(doc.data())
  })
  // console.log("all questions: ", allQuestion)
  return allQuestion
  // return querySnapshot
}