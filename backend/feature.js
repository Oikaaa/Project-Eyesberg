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

        async function getBook(){
          const res = await fetch('http://localhost:8080/api/books');
          const books = await res.json();
        
          //FOR YOU PAGE-----------------------
          let currentIndex = books.length;
          while(currentIndex !== 0){
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            
            [books[currentIndex], books[randomIndex]] = [books[randomIndex], books[currentIndex]];
          }
          fminBook = 0
          fmaxBook = 15
          document.getElementById('shelf').innerHTML = ''
          books.slice(fminBook, fmaxBook).forEach(function(item){
            const div = document.createElement('div')
            div.classList.add('bookS')
            div.innerHTML = `
            <div class="books">
              <img class="imgG" src="${item.imageURL}" alt="">
              <div class="detailS">
                <h1 class="headerS">${item.name}</h1>
                <p class="authorS">by ${item.author}</p>
                <div class="otherS">
                  <p class="rateS">Rating: ${item.rate}</p>
                  <p class="likeS">- Likes: ${item.like}</p>
                </div>
              </div>
            </div>
            `
            const readS = document.createElement('button')
            readS.classList.add('readS')
            readS.innerText = 'Read'
            readS.addEventListener('click', function(){
              db.ref('users/' + uid).update({bookId: item.id})
              .then(()=>window.location.href = `./book.html?id=${item.id}`)
            })
            document.getElementById('shelf').appendChild(div)
            div.appendChild(readS)
            document.getElementById('shelf').appendChild(document.createElement('hr'))
          })

          window.addEventListener('scroll', function(){
            const top = Math.round(window.scrollY)
            const height = document.getElementById('body').scrollHeight
            const diff = window.innerHeight + 660
            if(diff > (height - top)){
              fminBook = fminBook + 15
              fmaxBook = fmaxBook + 15
              slicedFilt = books.slice(fminBook, fmaxBook)
              slicedFilt.forEach(function(item){
                const div = document.createElement('div')
                div.classList.add('bookS')
                div.innerHTML = `
                <div class="books">
                  <img class="imgG" src="${item.imageURL}" alt="">
                  <div class="detailS">
                    <h1 class="headerS">${item.name}</h1>
                    <p class="authorS">by ${item.author}</p>
                    <div class="otherS">
                      <p class="rateS">Rating: ${item.rate}</p>
                      <p class="likeS">- Likes: ${item.like}</p>
                    </div>
                  </div>
                </div>
                `
                const readS = document.createElement('button')
                readS.classList.add('readS')
                readS.innerText = 'Read'
                readS.addEventListener('click', function(){
                  db.ref('users/' + uid).update({bookId: item.id})
                  .then(()=>window.location.href = `./book.html?id=${item.id}`)
                })
                document.getElementById('shelf').appendChild(div)
                div.appendChild(readS)
                document.getElementById('shelf').appendChild(document.createElement('hr'))
              })
            }
          })

        }
        getBook()
        async function getBook1(){
          const res = await fetch('http://localhost:8080/api/books');
          const books = await res.json();

          //PEOPLE READING-------------
          minBookHP = 0
          maxBookHP = 5
          const weekly = books.filter((b) => b.type.split(', ').includes('weekly'))
          document.getElementById('bodyFeContain').innerHTML = ''
          weekly.slice(minBookHP, maxBookHP).forEach(function(item){
            const div = document.createElement('div')
            div.classList.add('bookHP')
            div.innerHTML = `
            <div class="ove">
              <img class="oeImg" src="${item.imageURL}" alt="">
            </div>
            <div class="detail">
              <h1 class="detailHd">${item.name}</h1>
              <p class="detailAu">By ${item.author}</p>
            </div>`
            div.addEventListener('click', function(){
              db.ref('users/' + uid).update({bookId: item.id})
              .then(()=>{window.location.href = `./book.html?id=${item.id}`})
            })
            document.getElementById('bodyFeContain').appendChild(div)
          })
          //Button work HP
          document.getElementById('previousHP').addEventListener('click', function(){
            document.getElementById('bodyFeContain').innerHTML = ''
            document.getElementById('nextHP').style.opacity = 1
            minBookHP = minBookHP - 5
            maxBookHP = maxBookHP - 5
            if(minBookHP <= weekly.length){
              document.getElementById('previousHP').style.opacity = 0
              minBookHP = 0
              maxBookHP = 5
            }
            weekly.slice(minBookHP, maxBookHP).forEach(function(item){
              const div = document.createElement('div')
              div.classList.add('bookHP')
              div.innerHTML = `
              <div class="ove">
                <img class="oeImg" src="${item.imageURL}" alt="">
              </div>
              <div class="detail">
                <h1 class="detailHd">${item.name}</h1>
                <p class="detailAu">By ${item.author}</p>
              </div>`
              div.addEventListener('click', function(){
                db.ref('users/' + uid).update({bookId: item.id})
                .then(()=>{window.location.href = `./book.html?id=${item.id}`})
              })
              document.getElementById('bodyFeContain').appendChild(div)
            })
          })
          console.log(weekly)
          document.getElementById('nextHP').addEventListener('click', function(){
            document.getElementById('bodyFeContain').innerHTML = ''
            document.getElementById('previousHP').style.opacity = 1
            minBookHP = minBookHP + 5
            maxBookHP = maxBookHP + 5
            if(maxBookHP >= weekly.length){
              document.getElementById('nextHP').style.opacity = 0
              minBookHP = weekly.length - 5
              maxBookHP = weekly.length
            }
            weekly.slice(minBookHP, maxBookHP).forEach(function(item){
              const div = document.createElement('div')
              div.classList.add('bookHP')
              div.innerHTML = `
              <div class="ove">
                <img class="oeImg" src="${item.imageURL}" alt="">
              </div>
              <div class="detail">
                <h1 class="detailHd">${item.name}</h1>
                <p class="detailAu">By ${item.author}</p>
              </div>`
              div.addEventListener('click', function(){
                db.ref('users/' + uid).update({bookId: item.id})
                .then(()=>{window.location.href = `./book.html?id=${item.id}`})
              })
              document.getElementById('bodyFeContain').appendChild(div)
            })
          })
          //NEW RELEASE-------------
          minBookFE = 0
          maxBookFE = 5
          const newR = books.filter((b) => b.type.split(', ').includes('new'))
          document.getElementById('bodyReContain').innerHTML = ''
          newR.slice(minBookFE, maxBookFE).forEach(function(item){
            const div = document.createElement('div')
            div.classList.add('bookNR')
            div.innerHTML = `
            <div class="ove">
              <img class="oeImg" src="${item.imageURL}" alt="">
            </div>
            <div class="detail">
              <h1 class="detailHd">${item.name}</h1>
              <p class="detailAu">By ${item.author}</p>
            </div>`
            div.addEventListener('click', function(){
              db.ref('users/' + uid).update({bookId: item.id})
              .then(()=>{window.location.href = `./book.html?id=${item.id}`})
            })
            document.getElementById('bodyReContain').appendChild(div)
          })
          //Button work FE
          document.getElementById('previousNR').addEventListener('click', function(){
            document.getElementById('bodyReContain').innerHTML = ''
            document.getElementById('nextNR').style.opacity = 1
            minBookFE = minBookFE - 5
            maxBookFE = maxBookFE - 5
            if(minBookFE <= newR.length){
              document.getElementById('previousNR').style.opacity = 0
              minBookFE = 0
              maxBookFE = 5
            }
            newR.slice(minBookFE, maxBookFE).forEach(function(item){
              const div = document.createElement('div')
              div.classList.add('bookNR')
              div.innerHTML = `
              <div class="ove">
                <img class="oeImg" src="${item.imageURL}" alt="">
              </div>
              <div class="detail">
                <h1 class="detailHd">${item.name}</h1>
                <p class="detailAu">By ${item.author}</p>
              </div>`
              div.addEventListener('click', function(){
                db.ref('users/' + uid).update({bookId: item.id})
                .then(()=>{window.location.href = `./book.html?id=${item.id}`})
              })
              document.getElementById('bodyReContain').appendChild(div)
            })
          })
          document.getElementById('nextNR').addEventListener('click', function(){
            document.getElementById('bodyReContain').innerHTML = ''
            document.getElementById('previousNR').style.opacity = 1
            minBookFE = minBookFE + 5
            maxBookFE = maxBookFE + 5
            if(maxBookFE >= newR.length){
              document.getElementById('nextNR').style.opacity = 0
              minBookFE = newR.length - 5
              maxBookFE = newR.length
            }
            newR.slice(minBookFE, maxBookFE).forEach(function(item){
              const div = document.createElement('div')
              div.classList.add('bookNR')
              div.innerHTML = `
              <div class="ove">
                <img class="oeImg" src="${item.imageURL}" alt="">
              </div>
              <div class="detail">
                <h1 class="detailHd">${item.name}</h1>
                <p class="detailAu">By ${item.author}</p>
              </div>`
              div.addEventListener('click', function(){
                db.ref('users/' + uid).update({bookId: item.id})
                .then(()=>{window.location.href = `./book.html?id=${item.id}`})
              })
              document.getElementById('bodyReContain').appendChild(div)
            })
          })
        }
        getBook1()
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

