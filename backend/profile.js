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

          //-----------------------------LibraryContent-----------------------------------
          async function getApi(){
            const res = await fetch('http://localhost:8080/api/books')
            const books = await res.json()

            document.querySelectorAll('.libraryContent').forEach(function(item){
              item.addEventListener('click', function(){
                document.querySelectorAll('.libraryContent').forEach(function(list){
                  list.classList.remove('current')
                })
                this.classList.add('current')
                for(i=0;i<4;i++){
                  if(document.querySelectorAll('.libraryContent')[i].classList[1] == 'current'){
                    var cat = document.querySelectorAll('.libraryContent')[i].innerText.toLowerCase()
                    db.ref('users/' + uid + '/detail/' + cat).get()
                    .then((snapshot)=>{
                      const value = snapshot.val()
                      console.log(value.slice(1))
                      document.getElementById('libraryDisplay').innerHTML = ""
                      if(value.slice(1).length !== 0){
                        value.slice(1).forEach(function(item){
                          const findBook = books.find((i)=>i.id == item)
                          const div = document.createElement('div')
                          div.classList.add('bookLi')
                          div.addEventListener('click', function(){
                            const bookId = {
                              bookId: findBook.id
                            }
                            db.ref('users/' + uid).update(bookId)
                            .then(()=>{
                              window.location.href = '../book.html' + `?id=${findBook.id}`
                            })
                          })
                          div.innerHTML = `
                          <img style="height: 150px; aspect-ratio: 1/1.5; object-fit: cover;" src="${findBook.imageURL}" alt="">`
                          document.getElementById('libraryDisplay').appendChild(div)
                        })
                      }else{
                        document.getElementById('libraryDisplay').innerHTML = `<h1 style="font-size: 20px; font-weight: 300; text-align: center; margin-top: 125px; width: 100%">This dude doesn't like book:(</h1>`
                      }
                    })
                  }
                }
              })
            })
          }
          getApi()
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
