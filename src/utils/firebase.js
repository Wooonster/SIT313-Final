// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { ref, getStorage, uploadBytes } from 'firebase/storage'

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
    const createdAt = new Date().toLocaleString()
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

  if (docSnap.exists()) {
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
    let displayName = ''
    // console.log("username by email: ", docSnap.data())
    // if (docSnap.data().displayName !== '') {
    //   return docSnap.data().displayName
    // } else {
    //   console.log('ddocSnap.data().displayName', docSnap.data().additionalInfomation.displayName)
    //   return docSnap.data().additionalInfomation.displayName
    // }
    if (docSnap.data().displayName !== '' && docSnap.data().additionalInfomation.displayName === '')
      displayName = docSnap.data().displayName
    else if (docSnap.data().displayName === '' && docSnap.data().additionalInfomation.displayName !== '')
      displayName = docSnap.data().additionalInfomation.displayName
    else if (docSnap.data().displayName !== '' && docSnap.data().additionalInfomation.displayName !== '')
      displayName = docSnap.data().displayName
    else
      displayName = ''
    // console.log('displayname', displayName)
    return displayName
  } else {
    console.log("failed")
  }
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
export const updateUserPassword = async (email) => {
  sendPasswordResetEmail(auth, email).then(() => {
    console.log('sent')
  })
}

// save article
export const saveArticle2Fb = async (email, username, title, abstract, content, tags, addedPicture) => {
  const createTime = new Date().toLocaleString()

  try {
    await addDoc(collection(db, 'articles'), {
      email,
      username,
      title,
      abstract,
      content,
      createTime,
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
  const createTime = new Date().toLocaleString()
  // const questionDocRef = doc(db, 'questions')

  try {
    const docRef = await addDoc(collection(db, 'questions'), {
      email,
      username,
      createTime,
      title,
      content,
      tags,
    })
    console.log('new add question ref', docRef.id)

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
  let newList = []
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data())
    newList.push([doc.id, doc.data()])
  })
  // console.log('new question list', newList)
  // console.log("all questions: ", allQuestion)
  return newList
  // return querySnapshot
}

// read articles
export const readAllAriticles = async () => {
  const querySnapshot = await getDocs(collection(db, 'articles'))
  let articles = []
  querySnapshot.forEach(doc => {
    articles.push([doc.id, doc.data()])
  })
  return articles
}

// read question by id
export const getQuestionById = async (id) => {
  const docRef = doc(db, 'questions', id)
  try {
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      console.log(`question ${id} is: `, docSnap.data())
      return docSnap.data()
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (error) {
    console.log(`get question ${id} error: `, error.message)
  }
}

// read article by id
export const getArticleById = async (id) => {
  const docRef = doc(db, 'articles', id)
  try {
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(`get article ${id} error: `, error.message)
  }
}

export const addUserComment = async (email, username, comment, questionId) => {
  const commentDocRef = collection(db, 'comments')
  const createTime = new Date().toLocaleString()
  try {
    await addDoc(commentDocRef, {
      email,
      username,
      createTime,
      comment,
      questionId
    })
  } catch (error) {
    console.log('fail store comment', error.message)
  }
}

export const getUserComments = async () => {
  const commentDocRef = collection(db, 'comments')
  let allComments = []
  try {
    const querySnap = await getDocs(commentDocRef)
    querySnap.forEach((doc) => {
      allComments.push([doc.id, doc.data()])
    })
  } catch (error) {
    console.log('get all comments failed', error.message)
  }
  return allComments
}