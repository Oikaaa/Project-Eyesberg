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

//-------------------------------------------------

document.getElementById('search').addEventListener('click', function(){
    if(document.getElementById('searchInput').style.display === 'block'){
        document.getElementById('searchInput').style.display = 'none'
        document.getElementById('search_engine').style.display = 'none'
    }else{
        document.getElementById('searchInput').style.display = 'block'
        document.getElementById('search_engine').style.display = 'block'
    }
})

async function getApi(){
    const res = await fetch('http://localhost:8080/api/books')
    const bookFind = await res.json()
    
    document.getElementById('searchInput').addEventListener('input', ()=>{
        document.getElementById('con').innerHTML = ""
        const book = bookFind.filter((i) => i.name.toLowerCase().includes(document.getElementById('searchInput').value.toLowerCase()))
        if(book.length == 0){
            document.getElementById('con').innerHTML = `<h1 style="font-weight: 200; color: gray; font-size: 20px; text-align: center;">We can't find the book you want :(</h1>`
        }
        console.log(book)
        book.forEach(function(item){
            const a = document.createElement('a')
            a.classList.add('sBook')
            a.setAttribute('href', './book.html')
            a.addEventListener('click', function(e){
                e.preventDefault()
                auth.onAuthStateChanged((user)=>{
                    const bookId = {
                        bookId: item.id
                    }
                    db.ref('users/' + user.uid).update(bookId)
                    .then(()=>{
                        window.location.href = `../book.html?id=${item.id}`;
                    })
                })
            })

            a.innerHTML = `
            <img class="sImg" src="${item.imageURL}" alt="">
            <div style="padding: 0px 20px;">
                <h1 class="hdg hdas">${item.name}</h1>
                <h3 class="hdg adas">by ${item.author}</h3>
                <p class="hdg desss">${item.description}</p>
            </div>`

            document.getElementById('con').appendChild(a)
        })
    })
}
getApi()