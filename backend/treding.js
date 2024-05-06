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
  window.location.href = './user/profile.html'
})

document.querySelector('.gotoSetting').addEventListener('click',()=>{
  window.location.href = './user/edit.html'
})

document.querySelector('.gotoWishlist').addEventListener('click',()=>{
  window.location.href = './user/wishlist.html'
})

document.querySelector('.gotoCart').addEventListener('click',()=>{
  window.location.href = './user/cart.html'
})


async function bookApi(){
  const res = await fetch('http://localhost:8080/api/books')
  const book = await res.json()
  var minBook = 0
  var maxBook = 5
  slicedBook = book

  document.querySelectorAll('.ctLi').forEach(function(btn){
    btn.addEventListener('click',function(){
      minBook = 0
      maxBook = 5
      document.querySelectorAll('.ctLi').forEach((li)=>{
        li.classList.remove('current')
      })
      this.classList.add('current')
      console.log(this.classList[1])
      if(this.classList[1] !== 'novel'){
        slicedBook = book.filter((g) => g.type.includes(this.classList[1])).slice(minBook, maxBook)
      } else{
        slicedBook = book
      }
      slicedBook = slicedBook.slice(minBook, maxBook)
      console.log(slicedBook)

      document.getElementById('shelf').innerHTML = ``
      slicedBook.forEach(function(item, index){
        const bookT = document.createElement('div')
        bookT.classList.add('bookT')
        const genres = item.type.split(', ').map((gen) => `<div class="tags">${gen}</div>`).join("")
        bookT.innerHTML = `
      <div class="imggg">
        <img class="imageBookT" src="${item.imageURL}" alt="">
      </div>
      <div class="desT">
        <h1 class="headerT">${item.name}</h1>
        <p class="detailT">${item.description}</p>
        <div class="tagsT">
          ${genres}
        </div>
      </div>
    `
    const otherT = document.createElement('div')
    otherT.classList.add('otherT')
    const rankingNo = document.createElement('div')
    rankingNo.classList.add('rankingNo')
    rankingNo.classList.add('norno')
    rankingNo.classList.add('no'+index+1)
    const readT = document.createElement('div')
    readT.innerText = 'READ'

    readT.addEventListener('click', ()=>{
      auth.onAuthStateChanged((user)=>{
        const bookId = {
          bookId: item.id
        }
        db.ref('users/' + user.uid).update(bookId)
        .then(()=>{
          window.location.href = "./book.html"
        })
        .catch((e)=>{console.log(e)})
      })
    })
    readT.classList.add('readT')

    otherT.appendChild(rankingNo)
    otherT.appendChild(readT)
    bookT.appendChild(otherT)
    const hr = document.createElement('hr')

    document.getElementById('shelf').appendChild(bookT)
    document.getElementById('shelf').appendChild(hr)
      })
    })
  })

  //First loading--------------------------
  slicedBook = slicedBook.slice(minBook, maxBook)
  slicedBook.forEach(function(item, index){
    const bookT = document.createElement('div')
    bookT.classList.add('bookT')
    const genres = item.type.split(', ').map((gen) => `<div class="tags">${gen}</div>`).join("")
    bookT.innerHTML = `
      <div class="imggg">
        <img class="imageBookT" src="${item.imageURL}" alt="">
      </div>
      <div class="desT">
        <h1 class="headerT">${item.name}</h1>
        <p class="detailT">${item.description}</p>
        <div class="tagsT">
          ${genres}
        </div>
      </div>
    `
    const otherT = document.createElement('div')
    otherT.classList.add('otherT')
    const rankingNo = document.createElement('div')
    rankingNo.classList.add('rankingNo')
    rankingNo.classList.add('norno')
    rankingNo.classList.add('no'+index+1)
    const readT = document.createElement('div')
    readT.innerText = 'READ'

    readT.addEventListener('click', ()=>{
      auth.onAuthStateChanged((user)=>{
        const bookId = {
          bookId: item.id
        }
        db.ref('users/' + user.uid).update(bookId)
        .then(()=>{
          window.location.href = "./book.html"
        })
        .catch((e)=>{console.log(e)})
      })
    })
    readT.classList.add('readT')

    otherT.appendChild(rankingNo)
    otherT.appendChild(readT)
    bookT.appendChild(otherT)
    const hr = document.createElement('hr')

    document.getElementById('shelf').appendChild(bookT)
    document.getElementById('shelf').appendChild(hr)
  })
    //More----------------------------------
  document.getElementById('morebtn').addEventListener('click',function(){
    if(document.querySelector('.weekly').classList[2] === 'current'){
      console.log('w')
      slicedBook = book.filter((g) => g.type.includes(document.querySelector('.weekly').classList[1])).slice(minBook, maxBook)
      minBook = minBook + 5
      maxBook = maxBook + 5
      slicedBook.forEach(function(item, index){
        const bookT = document.createElement('div')
        bookT.classList.add('bookT')
        const genres = item.type.split(', ').map((gen) => `<div class="tags">${gen}</div>`).join("")
        bookT.innerHTML = `
      <div class="imggg">
        <img class="imageBookT" src="${item.imageURL}" alt="">
      </div>
      <div class="desT">
        <h1 class="headerT">${item.name}</h1>
        <p class="detailT">${item.description}</p>
        <div class="tagsT">
          ${genres}
        </div>
      </div>
    `
    const otherT = document.createElement('div')
    otherT.classList.add('otherT')
    const rankingNo = document.createElement('div')
    rankingNo.classList.add('rankingNo')
    rankingNo.classList.add('norno')
    rankingNo.classList.add('no'+index+1)
    const readT = document.createElement('div')
    readT.innerText = 'READ'

    readT.addEventListener('click', ()=>{
      auth.onAuthStateChanged((user)=>{
        const bookId = {
          bookId: item.id
        }
        db.ref('users/' + user.uid).update(bookId)
        .then(()=>{
          window.location.href = "./book.html"
        })
        .catch((e)=>{console.log(e)})
      })
    })
    readT.classList.add('readT')

    otherT.appendChild(rankingNo)
    otherT.appendChild(readT)
    bookT.appendChild(otherT)
    const hr = document.createElement('hr')

    document.getElementById('shelf').appendChild(bookT)
    document.getElementById('shelf').appendChild(hr)
      })
    } else if(document.querySelector('.comic').classList[2] === 'current'){
      console.log('w')
      slicedBook = book.filter((g) => g.type.includes(document.querySelector('.comic').classList[1])).slice(minBook, maxBook)
      minBook = minBook + 5
      maxBook = maxBook + 5
      slicedBook.forEach(function(item, index){
        const bookT = document.createElement('div')
        bookT.classList.add('bookT')
        const genres = item.type.split(', ').map((gen) => `<div class="tags">${gen}</div>`).join("")
        bookT.innerHTML = `
      <div class="imggg">
        <img class="imageBookT" src="${item.imageURL}" alt="">
      </div>
      <div class="desT">
        <h1 class="headerT">${item.name}</h1>
        <p class="detailT">${item.description}</p>
        <div class="tagsT">
          ${genres}
        </div>
      </div>
    `
    const otherT = document.createElement('div')
    otherT.classList.add('otherT')
    const rankingNo = document.createElement('div')
    rankingNo.classList.add('rankingNo')
    rankingNo.classList.add('norno')
    rankingNo.classList.add('no'+index+1)
    const readT = document.createElement('div')
    readT.innerText = 'READ'

    readT.addEventListener('click', ()=>{
      auth.onAuthStateChanged((user)=>{
        const bookId = {
          bookId: item.id
        }
        db.ref('users/' + user.uid).update(bookId)
        .then(()=>{
          window.location.href = "./book.html"
        })
        .catch((e)=>{console.log(e)})
      })
    })
    readT.classList.add('readT')

    otherT.appendChild(rankingNo)
    otherT.appendChild(readT)
    bookT.appendChild(otherT)
    const hr = document.createElement('hr')

    document.getElementById('shelf').appendChild(bookT)
    document.getElementById('shelf').appendChild(hr)
      })
    }else{
      minBook = minBook + 5
      maxBook = maxBook + 5
      slicedBook = book.slice(minBook, maxBook)
      slicedBook.forEach(function(item, index){
        const bookT = document.createElement('div')
        bookT.classList.add('bookT')
        const genres = item.type.split(', ').map((gen) => `<div class="tags">${gen}</div>`).join("")
        bookT.innerHTML = `
      <div class="imggg">
        <img class="imageBookT" src="${item.imageURL}" alt="">
      </div>
      <div class="desT">
        <h1 class="headerT">${item.name}</h1>
        <p class="detailT">${item.description}</p>
        <div class="tagsT">
          ${genres}
        </div>
      </div>
    `
    const otherT = document.createElement('div')
    otherT.classList.add('otherT')
    const rankingNo = document.createElement('div')
    rankingNo.classList.add('rankingNo')
    rankingNo.classList.add('norno')
    rankingNo.classList.add('no'+index+1)
    const readT = document.createElement('div')
    readT.innerText = 'READ'

    readT.addEventListener('click', ()=>{
      auth.onAuthStateChanged((user)=>{
        const bookId = {
          bookId: item.id
        }
        db.ref('users/' + user.uid).update(bookId)
        .then(()=>{
          window.location.href = "./book.html"
        })
        .catch((e)=>{console.log(e)})
      })
    })
    readT.classList.add('readT')

    otherT.appendChild(rankingNo)
    otherT.appendChild(readT)
    bookT.appendChild(otherT)
    const hr = document.createElement('hr')

    document.getElementById('shelf').appendChild(bookT)
    document.getElementById('shelf').appendChild(hr)
      })
    }
  })
}

bookApi()