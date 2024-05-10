const firebaseConfig = {
  apiKey: "AIzaSyAJ-xoAzovjhzestjTOenAceUPe_Gn4hUA",
  authDomain: "eyesberg-386cf.firebaseapp.com",
  projectId: "eyesberg-386cf",
  storageBucket: "eyesberg-386cf.appspot.com",
  messagingSenderId: "916996721492",
  appId: "1:916996721492:web:4e6318856a7e8d89d6d6c1",
  measurementId: "G-N9QMKLQP1L",
  databaseURL: "https://eyesberg-386cf-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database()
const db = database
const user = firebase.auth().currentUser;
const analytics = firebase.analytics();
var provider = new firebase.auth.GoogleAuthProvider();

//---------

const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const username = document.getElementById('username')
const userEmail = document.getElementById('userEmail')
const userPassword = document.getElementById('userPassword')
const confirmPassword = document.getElementById('confirmPassword')
const submitBtn = document.getElementById('submitButton')

submitBtn.addEventListener('click', (e)=>{
  e.preventDefault()

  if (firstName.value === "" || lastName.value === "" || username.value === "" || userEmail.value === "" || userPassword.value === "" || confirmPassword.value === "" ){
    alert('Please fill all the form')
  } else if (userPassword.value.length < 6){
      document.getElementById('lengthAlert').style.display = "block"
    }else{
    if (userPassword.value !== confirmPassword.value){
      document.getElementById('confirmAlert').style.display = "block"
    }else{
      var email = userEmail.value
      var password = userPassword.value
      auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        user.updateProfile({
          displayName: username.value,
          photoURL: "https://www.smashingmagazine.com/images/authors/sm-guest-author.jpg"
        })
        console.log(user)
        db.ref('users/' + user.uid).set({
          firstName: firstName.value,
          lastName: lastName.value,
          displayName: username.value,
          email: userEmail.value,
          bookId: 'null',
          description: 'Describe yourself...',
          detail:{
            rate: '',
            gender: 'male',
            dob: {
              date: '1',
              month: 'Jan',
              year: '2024',
            },
            billing: {
              country: 'Afhanistan',
              city: 'Kabul',
              zipcode: '1001',
              address: 'None',
            },
            payment: {
              cardId: 'null',
              nameHolder: 'null',
              cvc: 'null',
              expire: 'null',
            },
            wishlist: [0],
            saved: [0],
            cart: [0],
            read: [0],
            reading: [0],
            rent: [0],
            pending: [0],
          },
          setting:{
            namePublic: false,
            message: true,
            friend: true,
            profileViewable: 'everyone',
            emailViewable: false
          },
        }).then(()=>{
          alert('successful')
          window.location.replace('./sign_in.html')
        }).catch((error)=>{
          console.log(error)
        })
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage)
      });
    }
  }
})

