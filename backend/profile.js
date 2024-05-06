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
        const signupDate = new Date(user.metadata.creationTime);
        const date = moment(signupDate).format("DD MMM YYYY");

        document.getElementById('nameField').innerText = displayName
        document.getElementById('avatar').src = photoURL
        document.getElementById('userAvatar').src = photoURL
        document.getElementById('libraryHeader').innerHTML = `${displayName}'s library`
        document.getElementById('desHeader').innerHTML = `${displayName}'s description`
        document.getElementById('joinDate').innerHTML = `${date}`

        if(emailVerified === true){
          document.getElementById('userVerified').innerHTML = `Verified`
        }

        db.ref('users/' + user.uid).once('value')
          .then((snapshot)=>{
            const data = snapshot.val()
            const day = data.detail.dob.date
            const month = data.detail.dob.month
            const year = data.detail.dob.year
            const gender = data.detail.gender
            const description = data.description
            const namePublic = data.setting.namePublic

            if (namePublic === true){
              document.getElementById('upperProfileDetail').innerHTML = `<h1 class="upperDN">${displayName} <span style="font-style:italic; font-weight: 400; font-size: 15px;">(${data.firstName} ${data.lastName})</span> <a class="editProfileText" href="./edit.html">[edit profile]</a> </h1>`
            }else{
              document.getElementById('upperProfileDetail').innerHTML = `<h1 class="upperDN">${displayName} <a class="editProfileText" href="./edit.html">[edit profile]</a> </h1>`

            }

            if(data.setting.emailViewable === true){
              document.getElementById('emV').innerHTML = `
              <h3 class="smallText">Email</h3>
              <h3 class="smallText data">${email}</h3>
              `
            }

            document.getElementById('bornDate').innerHTML = `${day} ${month} ${year}`
            document.getElementById('userGen').innerHTML = `${gender}`
            document.getElementById('desContainer').innerHTML = `${description}`
          })
          .catch((e)=>{
            console.log(e)
          })
        } 
    } else {
      document.querySelectorAll('.profileNavi').forEach((item)=>{
        item.addEventListener('click',function() {
          console.log('hello')
          window.location.replace('../register.html')
        })
      })
      document.getElementById('profile').addEventListener('click',function() {
        console.log('hello')
        window.location.replace('../register.html')
      })
    }
  });

//--------------------------------


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
    window.location.replace('../index.html');
  })

  document.querySelector('.gotoProfile').addEventListener('click',()=>{
    window.location.href = './profile.html'
  })

  document.querySelector('.gotoSetting').addEventListener('click',()=>{
    window.location.href = './edit.html'
  })

  document.getElementById('userAvatar').addEventListener('click', ()=>{
    window.location.href = './edit.html'
  })

  document.querySelector('.gotoWishlist').addEventListener('click',()=>{
    window.location.href = './wishlist.html'
  })
  
  document.querySelector('.gotoCart').addEventListener('click',()=>{
    window.location.href = './cart.html'
  })
  