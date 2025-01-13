/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

/* === Firebase Setup === */
const firebaseConfig = {
    apiKey: "AIzaSyBZNlKRnm_ajNVh6MD7kmFhZ74TqBpnDE4",
    authDomain: "hot-and-cold-d05fd.firebaseapp.com",
    projectId: "hot-and-cold-d05fd",
    storageBucket: "hot-and-cold-d05fd.firebasestorage.app",
    messagingSenderId: "192859375818",
    appId: "1:192859375818:web:b6f3f39a3973f456f58c33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const user = auth.currentUser;
// console.log(auth)
// test if it works
console.log(db)
/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const navbar = document.getElementById("navbar")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")

const userProfilePictureEl = document.getElementById("user-profile-picture")

const userGreetingEl = document.getElementById("user-greeting")

const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")


/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

postButtonEl.addEventListener("click", postButtonPressed)


/* === Main Code === */

showLoggedOutView()

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
    console.log("Sign in with Google")
}

function authSignInWithEmail() {
    console.log("Sign in with email and password")
    /*  Challenge:
  1  Import the signInWithEmailAndPassword function from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
  2 Use the code from the documentation to make this function work.
  3  Make sure to first create two consts, 'email' and 'password', to fetch the values from the input fields emailInputEl and passwordInputEl.
   4 If the login is successful then you should show the logged in view using showLoggedInView()
   5   If something went wrong, then you should log the error message using console.error.
    */

    const email = emailInputEl.value
    const password = passwordInputEl.value
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            showLoggedInView()
        })
        .catch((error) => {
            console.error(error)
        })
}


function authCreateAccountWithEmail() {
    console.log("Sign up with email and password")
        /*  Challenge:
    1 Import the createUserWithEmailAndPassword function from from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
       2 Use the code from the documentation to make this function work.
       3 Make sure to first create two consts, 'email' and 'password', to fetch the values from the input fields emailInputEl and passwordInputEl.
       4 If the creation of user is successful then you should show the logged in view using showLoggedInView()
       5 If something went wrong, then you should log the error message using console.error.
    */
    const email = emailInputEl.value
    const password = passwordInputEl.value
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            showLoggedInView()
        })
        .catch((error) => {
            console.error(error)
        })
}


function authSignOut() {
    /*  Challenge:
         Import the signOut function from 'firebase/auth'
        Use the code from the documentation to make this function work.
   
        If the log out is successful then you should show the logged out view using showLoggedOutView()
        If something went wrong, then you should log the error message using console.error.
    */

    signOut(auth)
        .then(() => {
            showLoggedOutView()
        })
        .catch((error) => {
            console.error(error)
        })
}
 

/* == Functions - UI Functions == */
function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
    hideView(navbar)
}
 
 
function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
    showView(navbar)
}
 
 
function showView(view) {
    view.style.display = "flex"
}
 
 
function hideView(view) {
    view.style.display = "none"
}


function showProfilePicture(imgElement, user) {
    /*  Challenge:
        Use the documentation to make this function work.
       
        This function has two parameters: imgElement and user
       
        We will call this function inside of onAuthStateChanged when the user is logged in.
       
        The function will be called with the following arguments:
        showProfilePicture(userProfilePictureEl, user)
       
        If the user has a profile picture URL, set the src of imgElement to that URL.
       
        Otherwise, you should set the src of imgElement to "assets/images/default-profile-picture.jpeg"
    */

    if (user.photoURL) {
        imgElement.src = user.photoURL
    } else {
        imgElement.src = "assets/images/defaultPic.jpg"
    }
}


function showUserGreeting(element, user) {
    /*  Challenge:
        Use the documentation to make this function work.
       
        This function has two parameters: element and user
       
        We will call this function inside of onAuthStateChanged when the user is logged in.
       
        The function will be called with the following arguments:
        showUserGreeting(userGreetingEl, user)
       
        If the user has a display name, then set the textContent of element to:
        "Hi ___ ( your first name)"
        Where __ is replaced with the actual first name of the user
       
        Otherwise, set the textContent of element to:
        "Hey friend, how are you?"
    */

    if (user.displayName) {
        element.textContent = `Hi ${user.displayName}`
    } else {
        element.textContent = "Hey friend, how are you?"
    }
}

function clearInputField(field) {
    field.value = ""
}

function postButtonPressed() {
    const postBody = textareaEl.value
    const user = auth.currentUser
    const time = serverTimestamp()

    if (postBody) {
        addPostToDB(postBody, user, time)
        addPostToWeb(postBody, user, time)
        clearInputField(textareaEl)
    }
}
 
/* = Functions - Firebase - Cloud Firestore = */
async function addPostToDB(postBody, user, time) {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            body: postBody,
            uid: user.uid,
            timestamp: time
        })
        console.log(`Document written with ID: ${docRef.id}`)
    } catch (error) {
        console.error(error.message)
    }
}
 
 
console.log(app.options.projectId)

function addPostToWeb(postBody, user, time) {
    
    let post = document.getElementById("post")

    let username = document.getElementById("user")
    console.log(user.uid)
    username.textContent = user.uid

    let postDescription = document.getElementById("body")
    postDescription.textContent = postBody

    let timePosted = document.getElementById("timePosted")

    const date = new Date(time.toString())
    timePosted.textContent = date
    // let post = document.createElement("div")
    // post.innerHTML = "<p>test</p>"
    // post.className = "post-container"
    // let username = document.createElement("h1")
    // username.textContent = user.uid
    // let contentOfPost = document.createElement("p")
    // contentOfPost.textContent = postBody
    // document.createElement("div")



    document.appendChild(post)
    
    

}

// Main Code
onAuthStateChanged(auth, (user) => {
    if (user) {
        showLoggedInView()
        showProfilePicture(userProfilePictureEl, user)
        showUserGreeting(userGreetingEl, user)
    } else {
        showLoggedOutView()
    }
})


//credit: coursera