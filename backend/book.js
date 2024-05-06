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
    db.ref('users/' + user.uid).once('value')
    .then((snapshot)=>{
      const target = snapshot.val()

      async function bookDisplay(){
        const bookResponse = await fetch('http://localhost:8080/api/books')
        const bookResult = await bookResponse.json()
        const detailResponse = await fetch('backend/book.json')
        const detailResult = await detailResponse.json()

        const detail = detailResult.find((item)=> item.id === target.bookId)
        const book = bookResult.find((item)=> item.id === target.bookId)

        const genres = book.type.split(', ')
        const tagGenre = document.getElementById('tagGenre')

        document.getElementById('bookCover').src = book.imageURL
        document.getElementById('header').innerHTML = `${book.name}`
        document.getElementById('author').innerHTML = `${book.author}`
        document.getElementById('rating').innerHTML = `
        <i class="fa star fa-star" aria-hidden="true"></i>
        <i class="fa star fa-star" aria-hidden="true"></i>
        <i class="fa star fa-star" aria-hidden="true"></i>
        <i class="fa star fa-star" aria-hidden="true"></i>
        <i class="fa star fa-star" aria-hidden="true"></i>
        ${book.rate}
        `
        document.getElementById('price').innerHTML = `<sup style="font-size: 30px;">$</sup>${book.price}`

        //Genres--------------------------

        genres.forEach(function(item){
          const tagDiv = document.createElement('div')
          tagDiv.innerText = item
          tagDiv.classList.add('tag')
          tagGenre.appendChild(tagDiv)
          tagDiv.addEventListener('click', ()=>{
            window.location.href = './genres.html'
          })
        })
        var minBook = 0
        var maxBook = 3
        const matched = bookResult.filter((a)=>a.type.split(', ')[0] === genres[0])
        console.log(matched)
        document.getElementById('shelf').innerHTML = ''
        matched.slice(minBook, maxBook).forEach(function(item){
          const div = document.createElement('div')
          div.classList.add('suggBook')
          div.innerHTML = `
          <div style="height: 300px;box-shadow: 0px 0px 30px gray;overflow: hidden; border-radius: 0px 15px 15px 0px;"><img class="suggImg" src="${item.imageURL}" alt=""></div>
          <div>
            <h1 class="suggName">${item.name}</h1>
            <p class="suggAuth">${item.author}</p>
            <div style="display: flex; justify-content: left;">
              <p class="det suggRate"><i class="fa suggStar fa-star" aria-hidden="true"></i>${item.rate}</p>
              <p class="det suggLike">- ${item.like}</p>
            </div>
          </div>`
          div.addEventListener('click', function(){
            db.ref('users/' + uid).update({bookId: item.id})
            .then(()=>window.location.reload())
          })
          document.getElementById('shelf').appendChild(div)
        })
        //Previous
        document.getElementById('prevbtn').addEventListener('click', function(){
          document.getElementById('nextbtn').style.color = 'black'
          minBook = minBook - 3
          maxBook = maxBook - 3
          if(minBook <= 3){
            document.getElementById('prevbtn').style.color = 'gray'
            minBook = 0
            maxBook = 3
          }
          document.getElementById('shelf').innerHTML = ''
          matched.slice(minBook, maxBook).forEach(function(item){
            const div = document.createElement('div')
            div.classList.add('suggBook')
            div.innerHTML = `
            <div style="height: 300px;box-shadow: 0px 0px 30px gray;overflow: hidden; border-radius: 0px 15px 15px 0px;"><img class="suggImg" src="${item.imageURL}" alt=""></div>
            <div>
              <h1 class="suggName">${item.name}</h1>
              <p class="suggAuth">${item.author}</p>
              <div style="display: flex; justify-content: left;">
                <p class="det suggRate"><i class="fa suggStar fa-star" aria-hidden="true"></i>${item.rate}</p>
                <p class="det suggLike">- ${item.like}</p>
              </div>
            </div>`
            div.addEventListener('click', function(){
              db.ref('users/' + uid).update({bookId: item.id})
              .then(()=>window.location.reload())
            })
            document.getElementById('shelf').appendChild(div)
          })
        })
        //Next
        document.getElementById('nextbtn').addEventListener('click', function(){
          document.getElementById('prevbtn').style.color = 'black'
          minBook = minBook + 3
          maxBook = maxBook + 3
          if(minBook >= matched.length - 3){
            document.getElementById('nextbtn').style.color = 'gray'
            minBook = matched.length - 3
            maxBook = matched.length
          }
          document.getElementById('shelf').innerHTML = ''
          matched.slice(minBook, maxBook).forEach(function(item){
              const div = document.createElement('div')
              div.classList.add('suggBook')
              div.innerHTML = `
              <div style="height: 300px;box-shadow: 0px 0px 30px gray;overflow: hidden; border-radius: 0px 15px 15px 0px;"><img class="suggImg" src="${item.imageURL}" alt=""></div>
              <div>
                <h1 class="suggName">${item.name}</h1>
                <p class="suggAuth">${item.author}</p>
                <div style="display: flex; justify-content: left;">
                  <p class="det suggRate"><i class="fa suggStar fa-star" aria-hidden="true"></i>${item.rate}</p>
                  <p class="det suggLike">- ${item.like}</p>
                </div>
              </div>`
              div.addEventListener('click', function(){
                db.ref('users/' + uid).update({bookId: item.id})
                .then(()=>window.location.reload())
              })
              document.getElementById('shelf').appendChild(div)
          })
        })

        //----------------------------------------

        document.getElementById('edition').innerHTML = `
        <h1 class="ediHd">This Edition</h1>
        <div class="format"><p class="cons">Format</p><p class="con">2079 pages, ebook</p></div>
         <div class="format"><p class="cons">Published</p><p class="con">January 6, 2018 by Munpia</p></div>`
        document.getElementById('static').innerHTML = `
        <hr>
        <div style="display: flex; justify-content: space-around;">
          <p class="stat">${book.like} people like this</p>
          <p class="stat">52,680 people read this</p>
        </div>
        <hr>`
        document.getElementById('authorInf').innerHTML = `
        <h1 style="font-size: 25px; font-weight: 600;">About the author</h1>
        <div class="authorInfo">
          <div class="authorDetail">
            <div><img class="authorImg" src="./image/guest_avatar.jpg" alt=""></div>
            <div style="padding: 10px;">
              <h1 class="auName">${book.author}</h1>
              <p class="auFollower">392 followers</p>
            </div>
          </div>
          <button class="follow">Follow</button>
        </div>
        <hr>`
        document.getElementById('desc').innerHTML = `<span style="font-weight: 600; font-style: italic;">"${book.description}"</span> <br> <br>
        ${detail.des}`
        const wl = document.getElementById('wl')
        const sv = document.getElementById('sv')
        db.ref('users/' + user.uid + '/detail/wishlist').get()
        .then((snapshot)=>{
          const snValue = snapshot.val()
          const ssv = snValue.find((b)=>b === book.id)
          if(ssv !== undefined){
            wl.innerHTML = `Wishlist<i class="fa fa-check" aria-hidden="true"></i>`
          }else{
            wl.innerHTML = `Wishlist`
          }
        })
        db.ref('users/' + user.uid + '/detail/saved').get()
        .then((snapshot)=>{
          const snValue = snapshot.val()
          const ssv = snValue.find((b)=>b === book.id)
          if(ssv !== undefined){
            sv.innerHTML = `Saved<i class="fa fa-check" aria-hidden="true"></i>`
          }else{
            sv.innerHTML = `Save`
          }
        })
        //wishlist added-------------------
          wl.addEventListener('click', ()=>{
            db.ref('users/' + user.uid + '/detail/wishlist').get()
            .then((snapshot)=>{
              const snValue = snapshot.val()
              const ssv = snValue.find((b)=>b === book.id)
              if(ssv !== undefined){
                //remove from list
                const index = snValue.indexOf(book.id)
                snValue.splice(index, 1)
                db.ref('users/' + user.uid + '/detail/wishlist').set(snValue)
                wl.innerHTML = `Wishlist`
              }else{
                //add to list
                db.ref('users/' + user.uid + '/detail/wishlist').child(snValue.length).set(book.id)
                wl.innerHTML = `Wishlist<i class="fa fa-check" aria-hidden="true"></i>`
              }
            })
            .catch((e)=>alert(e))
          })
        //Save added--------------------------
        sv.addEventListener('click', ()=>{
          db.ref('users/' + user.uid + '/detail/saved').get()
          .then((snapshot)=>{
            const snValue = snapshot.val()
            const ssv = snValue.find((b)=>b === book.id)
            if(ssv !== undefined){
              //remove from list
              const index = snValue.indexOf(book.id)
              snValue.splice(index, 1)
              db.ref('users/' + user.uid + '/detail/saved').set(snValue)
              sv.innerHTML = `Save`
            }else{
              //add to list
              console.log(snValue[0])
              if(snValue[0] === "null"){
                const kl = {
                  0: book.id
                }
                db.ref('users/' + user.uid + '/detail/wishlist').update(kl)
              }
              db.ref('users/' + user.uid + '/detail/saved').child(snValue.length).set(book.id)
              sv.innerHTML = `Saved<i class="fa fa-check" aria-hidden="true"></i>`
            }
          })
          .catch((e)=>alert(e))
        })
      }
      bookDisplay()
    })
    .catch((e)=>{
      console.log(e)
    })
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

const starRating = document.getElementById('starRating')
const starno1 = document.getElementById('star1')
const starno2 = document.getElementById('star2')
const starno3 = document.getElementById('star3')
const starno4 = document.getElementById('star4')
const starno5 = document.getElementById('star5')

function star1(){
  starno1.style.color = 'goldenrod'
  starno1.classList.remove('fa-star-o')
  starno1.classList.add('fa-star')
}

function star2(){
  star1()
  starno2.style.color = 'goldenrod'
  starno2.classList.remove('fa-star-o')
  starno2.classList.add('fa-star')
}

function star3(){
  star1()
  star2()
  starno3.style.color = 'goldenrod'
  starno3.classList.remove('fa-star-o')
  starno3.classList.add('fa-star')
}

function star4(){
  star1()
  star2()
  star3()
  starno4.style.color = 'goldenrod'
  starno4.classList.remove('fa-star-o')
  starno4.classList.add('fa-star')
}

function star5(){
  star1()
  star2()
  star3()
  star4()
  starno5.style.color = 'goldenrod'
  starno5.classList.remove('fa-star-o')
  starno5.classList.add('fa-star')
}

function starReset(){
  starno1.style.color = 'gray'
  starno2.style.color = 'gray'
  starno3.style.color = 'gray'
  starno4.style.color = 'gray'
  starno5.style.color = 'gray'
  starno1.classList.add('fa-star-o')
  starno2.classList.add('fa-star-o')
  starno3.classList.add('fa-star-o')
  starno4.classList.add('fa-star-o')
  starno5.classList.add('fa-star-o')
  starno1.classList.remove('fa-star')
  starno2.classList.remove('fa-star')
  starno3.classList.remove('fa-star')
  starno4.classList.remove('fa-star')
  starno5.classList.remove('fa-star')
}

document.getElementById('moreOption').addEventListener('click', function(){
  if(document.getElementById('buyOther').style.display === 'none'){
    document.getElementById('buyOther').style.display = 'block'
  }else{
    document.getElementById('buyOther').style.display = 'none'
  }
})