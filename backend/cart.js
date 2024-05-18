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
  const db = database
  const user = firebase.auth().currentUser;
  var provider = new firebase.auth.GoogleAuthProvider();

//------------Firebase--------------------
auth.onAuthStateChanged((user) => {
if (user) {
    const uid = user.uid;
    if (user !== null) {
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;

        document.getElementById('nameField').innerText = displayName
        document.getElementById('avatar').src = photoURL

        async function getApi(){
          const res = await fetch('http://localhost:8080/api/books')
          const wishBook = await res.json()
          db.ref('users/' + uid + '/detail/cart').get()
          .then((snapshot)=>{
            document.getElementById('wwcontainer').innerHTML = ""
            const wB = snapshot.val().slice(1)
            if(wB.length === 0){
              document.getElementById('wwcontainer').innerHTML = `
              <h1 style="font-weight: 300; font-size: 25px;">Doesn't have any books here:(</h1>
              `
            }
            wB.forEach(function(n){
              const findedB = wishBook.find((b) => b.id===n)
              const wBook = document.createElement('div')
              wBook.classList.add('wishBook')
              wBook.innerHTML = `
              <div class="woverflow">
                  <img class="wBookImg" src="${findedB.imageURL}" alt="">
              </div>
                  <h2 class="wBookHeader">${findedB.name}</h2>
                  <p class="wBookAuthor">${findedB.author}</p>
              </div>`
              wBook.addEventListener('click', ()=>{
                db.ref('users/' + uid).update({bookId: findedB.id})
                .then(()=>{
                  window.location.href = "../book.html"
                })
                .catch((e)=>alert(e))
              })
              document.getElementById('wwcontainer').appendChild(wBook)
            })
          })
        }
        getApi()
    }
    } else {
      document.querySelectorAll('.profileNavi').forEach((item)=>{
        item.addEventListener('click',function() {
          console.log('hello')
          window.location.replace('./register.html')
        })
      })
      document.getElementById('profile').addEventListener('click',function() {
        console.log('hello')
        window.location.replace('./register.html')
      })
    }
});

function profileDrop(){
  document.getElementById('profileDropdown').style.display = "block"
}

function profileOut(){
  document.getElementById('profileDropdown').style.display = "none"
}

document.getElementById('logOutBtn').addEventListener('click',()=>{
  auth.signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  window.location.reload();
})

document.querySelector('.gotoProfile').addEventListener('click',()=>{
    window.location.href = './profile.html'
  })
  
  document.querySelector('.gotoSetting').addEventListener('click',()=>{
    window.location.href = './edit.html'
  })
  
  document.querySelector('.gotoWishlist').addEventListener('click',()=>{
    window.location.href = './wishlist.html'
  })
  
  document.querySelector('.gotoCart').addEventListener('click',()=>{
    window.location.href = './cart.html'
  })
  