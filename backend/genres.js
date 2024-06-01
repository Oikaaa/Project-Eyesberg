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
  const slo = await fetch('backend/genresDes.json')
  const desSl = await slo.json()

  const shelf = document.getElementById('shelf')
  var minBook = 0
  var maxBook = 14
  var filteredBook = book.filter((b)=>b.type.split(', ').includes('fiction'))

  var slicedFilt = filteredBook.slice(minBook, maxBook)

  //genre selector
  document.querySelectorAll('.genre').forEach(function(genre){
    genre.addEventListener('click', function(){
      document.querySelectorAll('.genre').forEach(function(current){
        current.classList.remove('current')
      })
      genre.classList.add('current')
      if(genre.getAttribute('value') === 'n-fiction'){
        document.getElementById('type').innerText = 'Non Fiction'
      } else if(genre.getAttribute('value') === 'k-novel'){
        document.getElementById('type').innerText = 'Webnovel'
      } else if(genre.getAttribute('value') === 'j-novel'){
        document.getElementById('type').innerText = 'Ligth Novel'
      } else{
        document.getElementById('type').innerText = genre.getAttribute('value').charAt(0).toUpperCase() + genre.getAttribute('value').slice(1)
      }

      const slogan = desSl.find((s)=>s.type === genre.getAttribute('value'))
      document.getElementById('typeSlogan').innerText =`"${slogan.des}"`

      //genre changing contaienr
      filteredBook = book.filter((b)=>b.type.split(', ').includes(genre.getAttribute('value')))
      minBook = 0
      maxBook = 14
      slicedFilt = filteredBook.slice(minBook, maxBook)
      shelf.innerHTML = ""
      slicedFilt.forEach(function(item){
        const bookG = document.createElement('div')
        bookG.classList.add('bookG')
        bookG.addEventListener('click', function(){
          auth.onAuthStateChanged((user)=>{
            const bookId = {
              bookId: item.id
            }
            db.ref('users/' + user.uid).update(bookId)
            .then(()=>{
              window.location.href =`./book.html?id=${item.id}`
            })
            .catch((e)=> alert(e))
          })
        })
        bookG.innerHTML = `
        <div class="imgDiv">
          <img src="${item.imageURL}" class="imgG" alt="">
        </div>
        <div class="detailG">
          <h1 class="hdG">${item.name}</h1>
          <div class="ratingG">
            <i class="fa star fa-star" aria-hidden="true"></i>
            <i class="fa star fa-star" aria-hidden="true"></i>
            <i class="fa star fa-star" aria-hidden="true"></i>
            <i class="fa star fa-star" aria-hidden="true"></i>
            <i class="fa star fa-star" aria-hidden="true"></i>
            <p class="rate">${item.rate}</p>
          </div>
          <div class="other detail">
            <p class="like"><span style="font-weight: 500;">Upvote:</span> ${item.like}</p>
          </div>
          <p class="desG">${item.description}</p>
          <h1 class="priceG">$${item.price}</h1>
        </div>
        `
        shelf.appendChild(bookG)
      })
    })
  })


  //first loading
  slicedFilt.forEach(function(item){
    const bookG = document.createElement('div')
    bookG.classList.add('bookG')
    bookG.addEventListener('click', function(){
      auth.onAuthStateChanged((user)=>{
        const bookId = {
          bookId: item.id
        }
        db.ref('users/' + user.uid).update(bookId)
        .then(()=>{
          window.location.href = `./book.html?id=${item.id}`
        })
        .catch((e)=> alert(e))
      })
    })
    bookG.innerHTML = `
    <div class="imgDiv">
      <img src="${item.imageURL}" class="imgG" alt="">
    </div>
    <div class="detailG">
      <h1 class="hdG">${item.name}</h1>
      <div class="ratingG">
        <i class="fa star fa-star" aria-hidden="true"></i>
        <i class="fa star fa-star" aria-hidden="true"></i>
        <i class="fa star fa-star" aria-hidden="true"></i>
        <i class="fa star fa-star" aria-hidden="true"></i>
        <i class="fa star fa-star" aria-hidden="true"></i>
        <p class="rate">${item.rate}</p>
      </div>
      <div class="other detail">
        <p class="like"><span style="font-weight: 500;">Upvote:</span> ${item.like}</p>
      </div>
      <p class="desG">${item.description}</p>
      <h1 class="priceG">$${item.price}</h1>
    </div>
    `
    shelf.appendChild(bookG)
  })

  window.addEventListener('scroll', function(){
    const top = Math.round(window.scrollY)
    const height = document.getElementById('body').scrollHeight
    const diff = window.innerHeight + 560

    if(diff > (height - top)){
      minBook = minBook + 14
      maxBook = maxBook + 14
      slicedFilt = filteredBook.slice(minBook, maxBook)
      slicedFilt.forEach(function(item){
        const bookG = document.createElement('div')
        bookG.classList.add('bookG')
        bookG.addEventListener('click', function(){
          auth.onAuthStateChanged((user)=>{
            const bookId = {
              bookId: item.id
            }
            db.ref('users/' + user.uid).update(bookId)
            .then(()=>{
              window.location.href = `./book.html?id=${item.id}`
            })
            .catch((e)=> alert(e))
          })
        })
        bookG.innerHTML = `
        <div class="imgDiv">
          <img src="${item.imageURL}" class="imgG" alt="">
        </div>
        <div class="detailG">
          <h1 class="hdG">${item.name}</h1>
          <div class="ratingG">
            <i class="fa star fa-star" aria-hidden="true"></i>
            <i class="fa star fa-star" aria-hidden="true"></i>
            <i class="fa star fa-star" aria-hidden="true"></i>
            <i class="fa star fa-star" aria-hidden="true"></i>
            <i class="fa star fa-star" aria-hidden="true"></i>
            <p class="rate">${item.rate}</p>
          </div>
          <div class="other detail">
            <p class="like"><span style="font-weight: 500;">Upvote:</span> ${item.like}</p>
          </div>
          <p class="desG">${item.description}</p>
          <h1 class="priceG">$${item.price}</h1>
        </div>
        `
        shelf.appendChild(bookG)
      })
    }
  })
}

bookApi()

console.log()