  auth.onAuthStateChanged((user) => {
    if (user) {
      const uid = user.uid;
      if (user !== null) {
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        const num = document.getElementById('num')
        const exp = document.getElementById('exp')

        document.getElementById('nameField').innerText = displayName
        document.getElementById('avatar').src = photoURL
        document.getElementById('dpname').value = displayName
        document.getElementById('userAvatar').src = photoURL

        db.ref('users/' + uid + '/detail/card').get()
        .then((snapshot)=>{
          num.value = snapshot.val().number
          exp.value = snapshot.val().expire
        })

        document.getElementById('saveasdbtn').addEventListener('click', function(){
          const num = document.getElementById('num')
          const exp = document.getElementById('exp')
          const card = {
            expire: exp.value,
            number: num.value
          }
          db.ref('users/' + uid + '/detail/card').update(card)
          gsap.to(".savedAnn", { x: -350 })
          setTimeout(() =>{
          gsap.to(".savedAnn", { x: 350 })
          },3000)
        })

          if(emailVerified === true){
            document.getElementById('verMail').style.display = 'none'
          }

          if(emailVerified === true){
            document.getElementById('lasEmail').innerHTML = `<p>Email: ${user.email} (verified)</p>`
          } else{
            document.getElementById('lasEmail').innerHTML = `<p>Email: ${user.email} (unverified)</p>`
          }
          document.getElementById('lasName').innerHTML = `<p>Username: ${user.displayName}</p>`
          document.getElementById('lasPass').innerHTML = `<p>Pass: ***************</p>`
          document.getElementById('photo').value = user.photoURL

          document.getElementById('setMail').addEventListener('click',function(e){
            e.preventDefault()

            const credential = promptForCredentials();
            user.reauthenticateWithCredential(credential).then(() => {
              // User re-authenticated.
              console.log('hi')
            }).catch((error) => {
              // An error occurred
              // ...
            });
            user.updateEmail(document.getElementById('emailChange').value).then(() => {
              // Update successful
              // ...
            }).catch((error) => {
              alert(error)
            });            
          })

        db.ref('users/' + user.uid).once('value')
            .then((snapshot)=>{
                const data = snapshot.val()

                document.getElementById('fname').value = data.firstName
                document.getElementById('lname').value = data.lastName
                if(data.setting.namePublic === true){
                    document.getElementById('anyone').setAttribute('checked', true)
                    document.getElementById('noone').removeAttribute('checked')
                }else if(data.setting.namePublic === false){
                  document.getElementById('noone').setAttribute('checked', true)
                  document.getElementById('anyone').removeAttribute('checked')
                }
                //-------------
                const gender = document.getElementById('gender')
                for (var i=0; i<gender.options.length; i++) {
                    var option = gender.options[i];
                    if (option.value === data.detail.gender) {
                       option.setAttribute('selected', true);
                       for (var i=0; i<gender.options.length; i++) {
                            if (option.value !== data.detail.gender && option.hasAttribute('selected')) {
                            option.removeAttribute('selected');      
                            } 
                        }
                    } 
                }
                //-------------
                const day = document.getElementById('day')
                const month = document.getElementById('month')
                const year = document.getElementById('year')

                for (var i=0; i<day.options.length; i++){
                    var option = day.options[i];
                    if(option.value === data.detail.dob.date){
                        option.setAttribute('selected', true)
                        for(var i=0;i<day.options.length; i++){
                            if (option.value !== data.detail.dob.date && option.hasAttribute('selected')){
                                option.removeAttribute('selected')
                            }
                        }
                    }
                }
                for (var i=0; i<month.options.length; i++){
                    var option = month.options[i];
                    if(option.value === data.detail.dob.month){
                        option.setAttribute('selected', true)
                        for(var i=0;i<month.options.length; i++){
                            if (option.value !== data.detail.dob.month && option.hasAttribute('selected')){
                                option.removeAttribute('selected')
                            }
                        }
                    }
                }
                for (var i=0; i<year.options.length; i++){
                    var option = year.options[i];
                    if(option.value === data.detail.dob.year){
                        option.setAttribute('selected', true)
                        for(var i=0;i<year.options.length; i++){
                            if (option.value !== data.detail.dob.year && option.hasAttribute('selected')){
                                option.removeAttribute('selected')
                            }
                        }
                    }
                }
                //-------------
                const country = document.getElementById('country')

                for (var i=0; i<country.options.length; i++){
                    var option = country.options[i]
                    if(option.value === data.detail.billing.country){
                        option.setAttribute('selected', true)
                        for(var i=0;i<country.options.length; i++){
                            if( option.value !== data.detail.billing.country && option.hasAttribute('selected')){
                                option.removeAttribute('selected')
                            }
                        }
                    }
                }
                //-------------
                document.getElementById('city').value = data.detail.billing.city
                document.getElementById('zipcode').value = data.detail.billing.zipcode
                document.getElementById('address').value = data.detail.billing.address
                document.getElementById('descriptionDetail').value = data.description

                ////////////////////////////////////////////

                const setting = data.setting
                const everyonePV = document.getElementById('anyonePV')
                const friendsPV = document.getElementById('friendsPV')
                const noonePV = document.getElementById('onlyPV')
                const anyoneEP = document.getElementById('anyoneEP')
                const nooneEP = document.getElementById('onlyEP')
                const anyoneFP = document.getElementById('anyoneFP')
                const nooneFP = document.getElementById('onlyFP')
                const anyoneES = document.getElementById('anyoneES')
                const nooneES = document.getElementById('onlyES')

                console.log(setting.message)

                document.querySelectorAll('.ES').forEach(function(item){
                  item.removeAttribute('checked')
                  if(setting.message === true){
                    anyoneES.setAttribute('checked', true)
                  } else{
                    nooneES.setAttribute('checked', true)
                  }
                })

                document.querySelectorAll('.pv').forEach(function(item){
                  item.removeAttribute('checked')
                  if(setting.profileViewable === 'anyone'){
                    everyonePV.setAttribute('checked', true)
                  } else if(setting.profileViewable === 'friends'){
                    friendsPV.setAttribute('checked', true)
                  } else{
                    noonePV.setAttribute('checked', true)
                  }
                })
                document.querySelectorAll('.ep').forEach(function(item){
                  item.removeAttribute('checked')
                  if(setting.emailViewable === true){
                    anyoneEP.setAttribute('checked', true)
                  } else{
                    nooneEP.setAttribute('checked', true)
                  }
                })
                document.querySelectorAll('.fr').forEach(function(item){
                  item.removeAttribute('checked')
                  if(setting.friend === true){
                    anyoneFP.setAttribute('checked', true)
                  } else{
                    nooneFP.setAttribute('checked', true)
                  }
                })
            })
            .catch((e)=>{
                console.log(e)
            })
        } 
        const firstName = document.getElementById('fname')
        const lastName = document.getElementById('lname')
        const dpname = document.getElementById('dpname')
        const descriptionDetail = document.getElementById('descriptionDetail')
        const gender = document.getElementById('gender')
        const day = document.getElementById('day')
        const country = document.getElementById('country')
        const city = document.getElementById('city')
        const zipcode = document.getElementById('zipcode')
        const address = document.getElementById('address')
        const anyone = document.getElementById('anyone')
        const noone = document.getElementById('noone')
        var namePublic = false;

        anyone.addEventListener('click',(item)=>{
          var value = item.target
          value.setAttribute('checked', true)
          noone.removeAttribute('checked')
          if(anyone.hasAttribute('checked')){
            namePublic = true
          }else{
            namePublic = false
          }
        })


        noone.addEventListener('click',(item)=>{
          var value = item.target
          value.setAttribute('checked', true)
          anyone.removeAttribute('checked')
          if(anyone.hasAttribute('checked')){
            namePublic = true
          }else{
            namePublic = false
          }
        })
        console.log(namePublic)
        //profile
        document.getElementById('savebtn').addEventListener('click', function(){
            if(firstName.value !== "" || dpname.value !== "" || lastName.value !== "" || country.value !== "" ){
              const changes = {
                  firstName: firstName.value,
                  lastName: lastName.value,
                  displayName: user.displayName,
                  email: user.email,
                  description: descriptionDetail.value,
                  detail:{
                      gender: gender.value,
                      dob: {
                      date: day.value,
                      month: month.value,
                      year: year.value,
                      },
                      billing: {
                      country: country.value,
                      city: city.value,
                      zipcode: zipcode.value,
                      address: address.value,
                      },
                      wishlist: ['null'],
                      saved: ['null'],
                      cart: ['null'],
                      read: ['null'],
                      reading: ['null'],
                  },
                  setting:{
                      namePublic: namePublic,
                      message: true,
                      friend: true,
                      profileViewable: true,
                      emailViewable: false
                  },
              };
              db.ref('users/' + user.uid).update(changes)              
              user.updateProfile({
                  displayName: dpname.value, photoURL: document.getElementById('photo').value
                }).then(() => {
                  // Profile updated!
                  // ...
                }).catch((error) => {
                  // An error occurred
                  // ...
                });
                gsap.to(".savedAnn", { x: -350 })
                setTimeout(() =>{
                  gsap.to(".savedAnn", { x: 350 })
                  },3000)
            }else{
              alert('Fill all the required form')
            }
        })

        //setting
        const everyonePV = document.getElementById('anyonePV')
        const friendsPV = document.getElementById('friendsPV')
        const noonePV = document.getElementById('onlyPV')
        const anyoneEP = document.getElementById('anyoneEP')
        const nooneEP = document.getElementById('onlyEP')
        const anyoneFP = document.getElementById('anyoneFP')
        const nooneFP = document.getElementById('onlyFP')
        const anyoneES = document.getElementById('anyoneES')
        const nooneES = document.getElementById('onlyES')
        var profileV = 'anyone'
        var emailVS = false
        var friendRq = true
        var message = true

        everyonePV.addEventListener('click', ()=>{
          friendsPV.removeAttribute('checked')
          noonePV.removeAttribute('checked')
          everyonePV.setAttribute('checked', true)
          profileV = 'anyone'
        })
        friendsPV.addEventListener('click', ()=>{
          everyonePV.removeAttribute('checked')
          noonePV.removeAttribute('checked')
          friendsPV.setAttribute('checked', true)
          profileV = 'friends'
        })
        noonePV.addEventListener('click', ()=>{
          friendsPV.removeAttribute('checked')
          everyonePV.removeAttribute('checked')
          noonePV.setAttribute('checked', true)
          profileV = 'noone'
        })

        anyoneEP.addEventListener('click',()=>{
          anyoneEP.setAttribute('checked', true)
          nooneEP.removeAttribute('checked')
          emailVS = anyoneEP.value === 'true'
        })
        nooneEP.addEventListener('click',()=>{
          nooneEP.setAttribute('checked', true)
          anyoneEP.removeAttribute('checked')
          emailVS = anyoneEP.value === 'false'
        })

        anyoneFP.addEventListener('click',()=>{
          anyoneFP.setAttribute('checked', true)
          nooneFP.removeAttribute('checked')
          friendRq = anyoneFP.value === 'true'
        })
        nooneFP.addEventListener('click',()=>{
          nooneFP.setAttribute('checked', true)
          anyoneFP.removeAttribute('checked')
          friendRq = anyoneFP.value === 'false'
        })

        document.getElementById('savebtnSet').addEventListener('click', function(){
          const newSet = {
              friend: friendRq,
              profileViewable: profileV,
              emailViewable: emailVS
          }
          db.ref('users/' + user.uid + '/setting/').update(newSet)
          gsap.to(".savedAnn", { x: -350 })
          setTimeout(() =>{
          gsap.to(".savedAnn", { x: 350 })
          },3000)
        })
        //-----------------------Email------------------------------
        anyoneES.addEventListener('click', function(){
          anyoneES.setAttribute('checked', true)
          nooneES.removeAttribute('checked')
          message = anyoneES.value === 'true'
        })
        nooneES.addEventListener('click', function(){
          nooneES.setAttribute('checked', true)
          nooneES.removeAttribute('checked')
          message = anyoneES.value === 'false'
        })
        
        document.getElementById('savebtnMail').addEventListener('click', function(){
          const emailSet = {
            message: message,
          }
          db.ref('users/' + user.uid + '/setting/').update(emailSet)
          gsap.to(".savedAnn", { x: -350 })
          setTimeout(() =>{
          gsap.to(".savedAnn", { x: 350 })
          },3000)
        })
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

  //---------

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


      //---------------Display-----------------------

      const edLi = document.querySelectorAll('.edLi')
      edLi.forEach((list)=>{
        list.addEventListener('click',function(){
          edLi.forEach((list)=>{
            list.classList.remove('current')
          })
          this.classList.add('current')
          const edDisplay = document.querySelectorAll('.edDisplay')
          for (var i=0; i<edDisplay.length; i++){
            edDisplay[i].style.display = 'none'
            if(this.classList[1] === edDisplay[i].classList[1]){
              edDisplay[i].style.display = 'block'
            }
          }
        })
      })

document.getElementById('savedAnn').addEventListener('click', ()=>{
  gsap.to(".savedAnn", { x: 350 })
})

document.getElementById('verMail').addEventListener('click', ()=>{
  auth.currentUser.sendEmailVerification()
  .then(() => {
    
  });
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

document.getElementById('edLD').addEventListener('click',()=>{
  if(document.getElementById('formCh').style.display === 'none'){
    document.getElementById('formCh').style.display = 'block'
  }else{
    document.getElementById('formCh').style.display = 'none'
  }
})


document.getElementById('setPass').addEventListener('click',function(){
  
})