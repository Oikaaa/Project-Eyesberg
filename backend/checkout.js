auth.onAuthStateChanged((user) => {
if (user) {
    const uid = user.uid;
    if (user !== null) {
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        const cardNumber = document.getElementById('c-number') 
        const expireDate = document.getElementById('e-number') 
        const cvc = document.getElementById('cvc') 
        const poas = document.getElementById('poas')

        async function bookAPI(){
          const res = await fetch('http://localhost:8080/api/books')
          const book = await res.json()
          var pendingPrice = 0
          var cartPrice = 0

          db.ref('users/' + uid + '/detail/pending').get()
          .then((snapshot)=>{
            const val = snapshot.val().slice(1)
            var duration = ""
            var salePrice = 0

            val.forEach(function(item){
              const it = book.find((i)=>i.id == item.slice(0, 3)) 

              if(item.slice(-2) === 'd3'){
                duration = '3 Days'
                salePrice = (it.price/30 * 0.96).toFixed(2)
              } else if(item.slice(-2) === 'd7'){
                duration = '7 Days'
                salePrice = (it.price/4 * 0.94).toFixed(2)
              }else{
                duration = '30 Days'
                salePrice = (it.price * 0.92).toFixed(2)
              }
              const tr = document.createElement('tr')
              tr.classList.add('tr')
              tr.innerHTML = `
              <td class="td tdH">${it.name}</td>
              <td class="td dr">${duration}</td>
              <td class="td dp">$${salePrice}</td>`

              const otr = document.createElement('tr')
              otr.classList.add('otr')
              otr.innerHTML = `
              <td class="td tdor">$${it.price}/each</td>
              <td class="td tdor dr"></td>
              <td class="td tdor dp"></td>`

              pendingPrice = pendingPrice + parseFloat(salePrice)

              document.getElementById('tablessa').appendChild(tr)
              document.getElementById('tablessa').appendChild(otr)
            })
          })

          db.ref('users/' + uid + '/detail/cart').get()
          .then((snapshot)=>{
            const val = snapshot.val().slice(1)
            val.forEach(function(item){
              const it = book.find((i)=>i.id == item)
              const tr = document.createElement('tr')
              tr.classList.add('tr')
              tr.innerHTML = `
              <td class="td tdH">${it.name}</td>
              <td class="td tdH dr">All time</td>
              <td class="td tdH dp">$${it.price}</td>`

              const otr = document.createElement('tr')
              otr.classList.add('otr')
              otr.innerHTML = `
              <td class="td tdor">$${it.price}/each</td>
              <td class="td tdor dr"></td>
              <td class="td tdor dp"></td>`

              document.getElementById('tablessa').appendChild(tr)
              document.getElementById('tablessa').appendChild(otr)
              cartPrice = cartPrice + parseFloat(it.price)
              document.getElementById('finalePrice').innerText = `$${(pendingPrice + cartPrice).toFixed(2)}`
              document.getElementById('finaleUPrice').innerText = `$${(pendingPrice + cartPrice).toFixed(2)}`
            })
          })
        }
        bookAPI()

        db.ref('users/' + uid).get()
        .then((snapshot)=>{
          const val = snapshot.val()
          document.getElementById('fname').value = val.firstName.toUpperCase()
          document.getElementById('lname').value = val.lastName.toUpperCase()
          document.getElementById('email').value = val.email
          document.getElementById('address').value = val.detail.billing.address.toUpperCase() + ', ' + val.detail.billing.city.toUpperCase() + ', ' + val.detail.billing.country.toUpperCase()
        })

        db.ref('users/' + uid + '/detail/card').get()
        .then((snapshot)=>{
          if(snapshot.val() === null){
            return
          }else{
            cardNumber.value = snapshot.val().number
            expireDate.value = snapshot.val().expire
          }
        })

        document.getElementById('pck').addEventListener('click', function(){
          if(cardNumber.value !== "" || expireDate.value !== "" || cvc.value !== ""){
            const card = {
              card:{
                number: cardNumber.value,
                expire: expireDate.value
              }
            }
            db.ref('users/' + uid + '/detail').update(card)
            .then(()=>{
              db.ref('users/' + uid + '/detail/cart').get()
              .then((snapshot)=>{
                const cartItem = snapshot.val()
                db.ref('users/' + uid + '/detail/pending').get()
                .then((snapshot)=>{
                  const pendingItem = snapshot.val()
                  db.ref('users/' + uid + '/detail/reading').get()
                  .then((snapshot)=>{
                    const reading = snapshot.val()
                    pendingItem.slice(1).forEach(function(item){
                      reading.push(Math.floor(item.slice(0, item.length - 2)))
                    })
                    db.ref('users/' + uid + '/detail/pending').set({0:0})
                    cartItem.slice(1).forEach(function(item){
                      reading.push(item)
                    })
                    db.ref('users/' + uid + '/detail/cart').set({0:0})
                    console.log(reading)
                    db.ref('users/' + uid + '/detail/reading').set(reading)
                    .then(()=>{window.location.href = '../library.html'})
                  })
                })
              })
            })
          }else{
            alert('Error')
          }
        })

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
  