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

        //Book load
        async function BookApi(){
          const res = await fetch('http://localhost:8080/api/books')
          const book = await res.json()
          //Continue Reading
          db.ref('users/' + uid + '/detail/reading').get()
          .then((snapshot) => {
            if(snapshot.val().length === 1){
              return
            }else{
              document.getElementById('containerL').innerHTML = ''
            }
            document.getElementById('containerL').innerHTML = ''
            const val = snapshot.val()
            val.slice(1, 6).forEach((item)=>{
              const filteredB = book.find((b)=>b.id===item)
              const div = document.createElement('div')
              div.classList.add('bookL')
              div.innerHTML = `
              <div class="ove">
                <img class="bookLImg" src="${filteredB.imageURL}" alt="">
              </div>
              <div class="bd">
                <h1 class="bookLHd">${filteredB.name}</h1>
                <p class="bookLAu">${filteredB.author}</p>
              </div>`
              div.addEventListener('click', function(){
                db.ref('users/' + uid).update({bookId: filteredB.id})
                .then(()=> window.location.href = `./book.html?id=${filteredB.id}`)
              })
              document.getElementById('containerL').appendChild(div)
            })
          })
          //Wishlist
          db.ref('users/' + uid + '/detail/wishlist').get()
          .then((snapshot) => {
            if(snapshot.val().length === 1){
              return
            }else{
              document.getElementById('containerWL').innerHTML = ''
            }
            document.getElementById('containerWL').innerHTML = ''
            const val = snapshot.val()
            val.slice(1, 5).forEach((item)=>{
              const filteredB = book.find((b)=>b.id===item)
              const div = document.createElement('div')
              div.classList.add('bookL')
              div.innerHTML = `
              <div class="ove">
                <img class="bookLImg" src="${filteredB.imageURL}" alt="">
              </div>
              <div class="bd">
                <h1 class="bookLHd">${filteredB.name}</h1>
                <p class="bookLAu">${filteredB.author}</p>
              </div>`
              div.addEventListener('click', function(){
                db.ref('users/' + uid).update({bookId: filteredB.id})
                .then(()=> window.location.href = `./book.html?id=${filteredB.id}`)
              })
              document.getElementById('containerWL').appendChild(div)
            })
          })
          //Read Again
          db.ref('users/' + uid + '/detail/read').get()
          .then((snapshot) => {
            if(snapshot.val().length === 1){
              return
            }else{
              document.getElementById('containerRA').innerHTML = ''
            }
            const val = snapshot.val()
            val.slice(1, 5).forEach((item)=>{
              const filteredB = book.find((b)=>b.id===item)
              const div = document.createElement('div')
              div.classList.add('bookL')
              div.innerHTML = `
              <div class="ove">
                <img class="bookLImg" src="${filteredB.imageURL}" alt="">
              </div>
              <div class="bd">
                <h1 class="bookLHd">${filteredB.name}</h1>
                <p class="bookLAu">${filteredB.author}</p>
              </div>`
              div.addEventListener('click', function(){
                db.ref('users/' + uid).update({bookId: filteredB.id})
                .then(()=> window.location.href = `./book.html?id=${filteredB.id}`)
              })
              document.getElementById('containerRA').appendChild(div)
            })
          })
          //FYP
          var feArray = []
          const randomB = Math.floor(Math.random()*book.length)
          document.getElementById('containerFY').innerHTML = ''
          for(var i=randomB; i<randomB+5; i++){
            feArray.push(book[i])
          }
          feArray.forEach(function(item){
            const div = document.createElement('div')
              div.classList.add('bookL')
              div.innerHTML = `
              <div class="ove">
                <img class="bookLImg" src="${item.imageURL}" alt="">
              </div>
              <div class="bd">
                <h1 class="bookLHd">${item.name}</h1>
                <p class="bookLAu">${item.author}</p>
              </div>`
              div.addEventListener('click', function(){
                db.ref('users/' + uid).update({bookId: item.id})
                .then(()=> window.location.href = `./book.html?id=${item.id}`)
              })
              document.getElementById('containerFY').appendChild(div)
          })
        }
        BookApi()
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

document.querySelectorAll('.add').forEach(function(item){
  item.addEventListener('click', function(){
    window.location.href = './feature.html'
  })
})