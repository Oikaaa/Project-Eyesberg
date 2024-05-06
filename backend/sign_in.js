const firebaseConfig = {
    apiKey: "AIzaSyAJ-xoAzovjhzestjTOenAceUPe_Gn4hUA",
    authDomain: "eyesberg-386cf.firebaseapp.com",
    projectId: "eyesberg-386cf",
    storageBucket: "eyesberg-386cf.appspot.com",
    messagingSenderId: "916996721492",
    appId: "1:916996721492:web:4e6318856a7e8d89d6d6c1",
    databaseURL: "https://eyesberg-386cf-default-rtdb.asia-southeast1.firebasedatabase.app/",
    measurementId: "G-N9QMKLQP1L"
  };
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth()
  const database = firebase.database()
  const user = firebase.auth().currentUser;
  var provider = new firebase.auth.GoogleAuthProvider();

  //----

const userEmail = document.getElementById('userEmail')
const userPassword = document.getElementById('userPassword')
const submitBtn = document.getElementById('submitButton')

auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(user)
    // ...
  } else {
    // User is signed out
    // ...
    console.log(user)
  }
});

submitBtn.addEventListener('click',(e)=>{
    e.preventDefault()

    var email = userEmail.value
    var password = userPassword.value
    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log(user)
    window.location.href = './index.html'
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    if(errorMessage.includes('disable')){
      document.getElementById('passwordAlert').style.display = "block"
      document.getElementById('passwordAlert').innerHTML = errorMessage + ' Contact the help center if this was a mistakes'
    }else{
      document.getElementById('passwordAlert').style.display = "block"
    }
    
  });

})

function resetPassword(){
    var email = userEmail.value
    firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Type in your email in the email field")
  });
}

document.getElementById('googleAuth').addEventListener('click', ()=>{
  auth.signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
})

