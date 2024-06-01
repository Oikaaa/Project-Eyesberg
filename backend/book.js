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
        //RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT 
        document.getElementById('da').innerHTML = `3 Days <span class="fts"><span style="text-decoration: line-through;">$${(book.price/30).toFixed(2)}</span> $${(book.price/30 * 0.96).toFixed(2)}/3 days</span> <i class="fa fa-check" aria-hidden="true"></i>`
        document.getElementById('we').innerHTML = `7 Days <span class="fts"><span style="text-decoration: line-through;">$${(book.price/4).toFixed(2)}</span> $${(book.price/4 * 0.94).toFixed(2)}/7 days</span>`
        document.getElementById('mo').innerHTML = `1 Month <span class="fts"><span style="text-decoration: line-through;">$${book.price}</span> $${(book.price * 0.92).toFixed(2)}/30 days</span>`
        document.querySelectorAll('.rentLi').forEach(function(item){
          item.addEventListener('click', function(){
            document.querySelectorAll('.rentLi').forEach(function(ite){
              const removeCheck = ite.innerHTML.replace('<i class="fa fa-check" aria-hidden="true"></i>', "")
              ite.innerHTML = removeCheck
              ite.classList.remove('selected')
            })
            this.innerHTML = `${item.innerHTML} <i class="fa fa-check" aria-hidden="true"></i>`
            this.classList.add('selected')
          })
        })
        //RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT RENT 
        db.ref('users/' + uid + '/detail/pending').get()
        .then((snapshot)=>{
          const found = snapshot.val().find((i) => i === book.id)
          if(found === undefined){
            document.getElementById('durationOption').addEventListener('click', function(){
              if(document.getElementById('rentOther').style.display === 'block'){
                document.getElementById('rentOther').style.display = 'none'
              }else{
                document.getElementById('rentOther').style.display = 'block'
              }
            })
            document.getElementById('rentOption').addEventListener('click', function(){ 
          document.getElementById('modelCv').style.display = 'block'
          for (let i=0; i<document.querySelectorAll('.rentLi').length; i++){
            if(document.querySelectorAll('.rentLi')[i].classList[2] === 'selected'){
              var rentPrice = 0
              if(document.querySelectorAll('.rentLi')[i].innerText.slice(0, 2) == 3){
                rentPrice = ((book.price/30)*0.96).toFixed(2)
              }else if(document.querySelectorAll('.rentLi')[i].innerText.slice(0, 2) == 7){
                rentPrice = ((book.price/4)*0.94).toFixed(2)
              }else{
                rentPrice = (book.price*0.92).toFixed(2)
              }

              //proceed checkout
              db.ref('users/' + uid + '/detail/pending').get()
              .then((snapshot) =>{
                const val = snapshot.val()
                document.getElementById('pck').addEventListener('click', function(){
                  db.ref('users/' + uid + '/detail/pending').child(val.length).set(book.id + 'd' + document.querySelectorAll('.rentLi')[i].innerText.slice(0, 1))
                  .then(()=>{window.location.href = './user/checkout.html'})
                })
              })

                document.getElementById('rentIn').innerHTML = `Rent <span style="font-style: italic;">"${book.name}"</span> for ${document.querySelectorAll('.rentLi')[i].innerText.slice(0, 7)}`

                document.getElementById('rentIn1').innerHTML = `This book will be available in your library and readable for ${document.querySelectorAll('.rentLi')[i].innerText.slice(0, 7)} after this purchase, you can't refund after the purchase`

                document.getElementById('duration').innerHTML = `
                <h1 class="dHd">${document.querySelectorAll('.rentLi')[i].innerText.slice(0, 7)}</h1>
                <div class="dDes">
                    <p class="ssd">Rent for ${document.querySelectorAll('.rentLi')[i].innerText.slice(0, 7)}, renew manually</p> <p class="ssd ssp">$${rentPrice}</p>
                </div>`
            }
          }
            })
          }else{
            document.getElementById('rentOption').style.background = '#F2F2F2' 
            document.getElementById('rentOption').style.color = '#767676' 
            document.getElementById('durationOption').style.color = '#767676' 
            document.getElementById('durationOption').style.background = '#F2F2F2' 
            document.getElementById('rentOption').style.cursor = 'default' 
            document.getElementById('durationOption').style.cursor = 'default' 
            document.getElementById('rent').style.borderColor = '#F2F2F2'
          }
        })
        if(true){

        }
        //CART CART CART CART CART CART CART CART CART CART CART CART CART CART CART CART CART CART CART CART CART

        db.ref('users/' + uid + '/detail/cart').get()
          .then((snapshot)=>{
            const val = snapshot.val()
            const ssv = val.find((b)=>b === book.id)
              if(ssv !== undefined){
                //removed from cart
                document.getElementById('buy').innerText = 'Added'
              }else{
                //add to list
                document.getElementById('buy').innerText = 'Buy Now'
              }
          })

          //BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY 

        document.getElementById('buy').addEventListener('click', function(){
          db.ref('users/' + uid + '/detail/cart').get()
          .then((snapshot)=>{
            const val = snapshot.val()
            const ssv = val.find((b)=>b === book.id)
              if(ssv !== undefined){
                //remove from list
                const index = val.indexOf(book.id)
                val.splice(index, 1)
                db.ref('users/' + user.uid + '/detail/cart').set(val)
                .then(()=>{
                  document.getElementById('buy').innerText = 'Buy Now'
                  document.getElementById('addedAnn').innerHTML = ``
                  document.getElementById('addedAnn').innerHTML = `<h1 class="addedAnHd"><i class="fa check fa-check-circle" aria-hidden="true"></i>Removed to cart</h1>`
                  gsap.to(document.getElementById('addedAnn'), {x: -350})
                  setTimeout(function(){
                    gsap.to(document.getElementById('addedAnn'), {x: 350})
                    }, 5000)
                })
              }else{
                //add to list
                db.ref('users/' + user.uid + '/detail/cart').child(val.length).set(book.id)
                .then(()=>{
                  document.getElementById('addedAnn').innerHTML = ``
                  document.getElementById('addedAnn').innerHTML = `<h1 class="addedAnHd"><i class="fa check fa-check-circle" aria-hidden="true"></i>Added to cart</h1>`
                  document.getElementById('buy').innerText = 'Added to cart'
                  gsap.to(document.getElementById('addedAnn'), {x: -350})
                  setTimeout(function(){
                  gsap.to(document.getElementById('addedAnn'), {x: 350})
                  }, 5000)
                })
              }
          })
        })

        //BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY BUY 

        document.getElementById('bookCover').src = book.imageURL
        document.getElementById('header').innerHTML = `${book.name}`
        document.getElementById('author').innerHTML = `${book.author}`
        //RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING 
        var rating = Number(book.rate)
        var unit = Math.floor(rating/2)
        var decimal = 0

        document.getElementById('rating').innerHTML = ``

        for (i=0; i<unit; i++){
          const full_star = document.createElement('i')
          full_star.classList.add('fa')
          full_star.classList.add('star')
          full_star.classList.add('fa-star')
          full_star.setAttribute('aria-hidden', true)
          document.getElementById('rating').appendChild(full_star)
        }

        console.log(rating)
        console.log(rating/2)
        console.log(unit)
        console.log(Number((rating/2 - unit).toFixed(2)))

        if(Number((rating/2 - unit).toFixed(1)) >= 0.75){
          const full_star = document.createElement('i')
          full_star.classList.add('fa')
          full_star.classList.add('star')
          full_star.classList.add('fa-star')
          full_star.setAttribute('aria-hidden', true)
          document.getElementById('rating').appendChild(full_star)
        }else if(Number((rating/2 - unit).toFixed(1)) < 0.75 && Number((rating/2 - unit).toFixed(1)) >= 0.3){
          const full_star = document.createElement('i')
          full_star.classList.add('fa')
          full_star.classList.add('star')
          full_star.classList.add('fa-star-half-o')
          full_star.setAttribute('aria-hidden', true)
          document.getElementById('rating').appendChild(full_star)
        }else{
          const full_star = document.createElement('i')
          full_star.classList.add('fa')
          full_star.classList.add('star')
          full_star.classList.add('fa-star-o')
          full_star.setAttribute('aria-hidden', true)
          document.getElementById('rating').appendChild(full_star)
        }
        const ha = document.createElement('p')
        ha.setAttribute('style', 'margin: 0px;')
        ha.innerText = book.rate
        document.getElementById('rating').appendChild(ha)




        //RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING RATING 
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
        //WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST 
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

        //WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST WISHLIST 
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

document.getElementById('modelCv').addEventListener('click', function(e){
  if(document.getElementById('rentModel').contains(e.target)){

  }else{
    document.getElementById('modelCv').style.display = 'none'
  }
})