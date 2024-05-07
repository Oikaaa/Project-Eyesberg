const firebaseConfig = {
  apiKey: "AIzaSyAJ-xoAzovjhzestjTOenAceUPe_Gn4hUA",
  authDomain: "eyesberg-386cf.firebaseapp.com",
  projectId: "eyesberg-386cf",
  storageBucket: "eyesberg-386cf.appspot.com",
  messagingSenderId: "916996721492",
  appId: "1:916996721492:web:4e6318856a7e8d89d6d6c1",
  databaseURL:
    "https://eyesberg-386cf-default-rtdb.asia-southeast1.firebasedatabase.app/",
  measurementId: "G-N9QMKLQP1L",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
const db = database;
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

      document.getElementById("nameField").innerText = displayName;
      document.getElementById("avatar").src = photoURL;
    }
  } else {
    document.querySelectorAll(".profileNavi").forEach((item) => {
      item.addEventListener("click", function () {
        console.log("hello");
        window.location.replace("./register.html");
      });
    });
    document.getElementById("profile").addEventListener("click", function () {
      console.log("hello");
      window.location.replace("./register.html");
    });
  }
});

//------------Quote-------------------
var category = "knowledge";

$.ajax({
  method: "GET",
  url: "https://api.api-ninjas.com/v1/quotes?category=" + category,
  headers: { "X-Api-Key": "RwpecBSBgFYxYpvWYSsmVA==65VOAcEEpzuC4tVM" },
  contentType: "application/json",
  success: function (result) {
    const theQuote = document.getElementById("theQuote");
    const quoteAuthor = document.getElementById("quoteAuthor");
    theQuote.innerText = `"${result[0].quote}"`;
    quoteAuthor.innerText = `-${result[0].author}-`;
  },
  error: function ajaxError(jqXHR) {
    console.error("Error: ", jqXHR.responseText);
  },
});

//-------------Book API----------------
async function genreAPI() {
  try {
    const response = await fetch("http://localhost:8080/api/books");
    const data = await response.json();

    const cc = data.filter((b) => b.type.split(", ").includes("weekly"));
    document.getElementById("communityContainer").innerHTML = "";
    cc.slice(0, 4).forEach(function (item) {
      const div = document.createElement("div");
      div.classList.add("bookCB");
      div.classList.add("book");
      div.innerHTML = `
      <div class="overflowCB">
        <img class="communityBookImg" src="${item.imageURL}" alt="">
      </div>
      <h2 class="communityBookHeader">${item.name}</h2>
      <p class="communityBookAuthor">${item.author}</p>
      <p class="communityPrice">$${item.price}</p>`;
      div.addEventListener("click", function () {
        auth.onAuthStateChanged((user) => {
          db.ref("users/" + user.uid)
            .update({ bookId: item.id })
            .then(() => {
              window.location.href = "./book.html";
            });
        });
      });
      document.getElementById("communityContainer").appendChild(div);
    });

    const genresListsContext = document.querySelectorAll(".genresListsContext"); //Select class
    genresListsContext.forEach((item) => {
      //add event to all
      item.addEventListener("click", function () {
        genresListsContext.forEach((item) => {
          //When click, remove all
          item.classList.remove("current"); //the "current" class innit
        });

        this.classList.add("current"); //"this" is current click list, add current into it
        const genreShelf = document.getElementById("genresBookshelf");
        genreShelf.innerHTML = "";
        const typeBooks = data.filter((book) => {
          return book.type
            .split(", ")
            .includes(
              `${document.querySelector(".current").textContent.toLowerCase()}`
            );
        });
        console.log(typeBooks);
        typeBooks.forEach((ebook) => {
          const genreBook = document.createElement("div");
          genreBook.classList.add("genresBook");
          genreBook.classList.add("book");
          //---------------
          auth.onAuthStateChanged((user) => {
            genreBook.addEventListener("click", function () {
              const bookID = {
                bookId: ebook.id,
              };
              db.ref("users/" + user.uid)
                .update(bookID)
                .then(() => {
                  window.location.href = "./book.html";
                })
                .catch((e) => {
                  console.log(e);
                });
            });
          });

          const genres = ebook.type
            .split(", ")
            .map(
              (genre) =>
                `<div class="tags ${genre.toLowerCase()}">${
                  genre.charAt(0).toUpperCase() + genre.slice(1)
                }</div>`
            )
            .join("");
          genreBook.innerHTML = `<div class="genresImgDiv">
            <img class="genresImg" src="${ebook.imageURL}" alt="">
          </div>
          <div class="genresBookDetail">
            <h1 class="genresBookHeader">${ebook.name}</h1>
            <p class="genresBookDes">${ebook.description}</p>
            <div class="genresTagsDiv">
              <div class="genresTags">
                ${genres}
              </div>
              <h1 class="price">$${ebook.price}</h1>
            </div>
          </div>`;
          genreShelf.appendChild(genreBook);
        });
      });
    });

    //First loading
    const currentBookCat = `${document
      .querySelector(".current")
      .textContent.toLowerCase()}`;
    const typeBooks = data.filter((book) => {
      return book.type.split(", ").includes(currentBookCat);
    });
    typeBooks.forEach((ebook) => {
      const genreShelf = document.getElementById("genresBookshelf");
      const genreBook = document.createElement("div");
      genreBook.classList.add("genresBook");
      auth.onAuthStateChanged((user) => {
        genreBook.addEventListener("click", function () {
          const bookID = {
            bookId: ebook.id,
          };
          db.ref("users/" + user.uid)
            .update(bookID)
            .then(() => {
              window.location.href = "./book.html";
            })
            .catch((e) => {
              console.log(e);
            });
        });
      });
      genreBook.classList.add("book");
      const genres = ebook.type
        .split(", ")
        .map(
          (genre) =>
            `<div class="tags ${genre.toLowerCase()}">${
              genre.charAt(0).toUpperCase() + genre.slice(1)
            }</div>`
        )
        .join("");
      genreBook.innerHTML = `<div class="genresImgDiv">
        <img class="genresImg" src="${ebook.imageURL}" alt="">
      </div>
      <div class="genresBookDetail">
        <h1 class="genresBookHeader">${ebook.name}</h1>
        <p class="genresBookDes">${ebook.description}</p>
        <div class="genresTagsDiv">
          <div class="genresTags">
            ${genres}
          </div>
          <h1 class="price">$${ebook.price}</h1>
        </div>
      </div>`;
      genreShelf.appendChild(genreBook);
    });

    //--------------------------------------------------

    const weeklyBooks = data.filter((book) =>
      book.type.split(", ").includes("weekly")
    );
    weeklyBooks.slice(0, 3).forEach((book) => {
      const topPick = document.getElementById("topPick");
      const topNovel = document.createElement("div");
      topNovel.classList.add("topNovel");
      topNovel.classList.add("book");
      topNovel.innerHTML = `<img src="${book.imageURL}" alt="" class="topImg">
      <h3 class="topTitle top1">${book.name}</h3>`;
      topPick.appendChild(topNovel);
      //-----------------
      auth.onAuthStateChanged((user) => {
        topNovel.addEventListener("click", function () {
          const bookID = {
            bookId: book.id,
          };
          db.ref("users/" + user.uid)
            .update(bookID)
            .then(() => {
              window.location.href = "./book.html";
            })
            .catch((e) => {
              console.log(e);
            });
        });
      });
    });

    //------------------Feature------------------------
    var randomFeat = Math.floor(Math.random() * data.length);
    var feArray = [];

    for (var a = 0; a >= 0; a++) {
      if (randomFeat < data.length - 14) {
        break;
      } else {
        randomFeat = Math.floor(Math.random() * data.length);
      }
    }

    for (var i = randomFeat; i < randomFeat + 14; i++) {
      feArray.push(data[i]);
    }
    feArray.forEach(function (item) {
      if (item !== undefined) {
        const feaDiv = document.createElement("div");
        feaDiv.classList.add("bookDiv");
        feaDiv.classList.add("book");
        feaDiv.innerHTML = `
        <div class="overflow">
        <img class="featureBookImg" src="${item.imageURL}" alt="">
        </div>
        <h2 class="featureBookHeader">${item.name}</h2>
        <p class="featureBookAuthor">${item.author}</p>
        <p class="featurePrice">$${item.price}</p>
        `;
        document.getElementById("featureContainer").appendChild(feaDiv);
        auth.onAuthStateChanged((user) => {
          feaDiv.addEventListener("click", () => {
            db.ref("users/" + user.uid)
              .update({ bookId: item.id })
              .then(() => {
                window.location.href = "./book.html";
              })
              .catch((e) => {
                console.log(e);
              });
          });
        });
      }
    });
    //------------------Best Seller------------------------

    const bs = data.filter((book) => {
      return book.type.split(", ").includes("top seller");
    });
    bs.forEach((item) => {
      async function bookDet() {
        const det = await fetch("backend/book.json");
        const resDet = await det.json();
        const val = resDet.find((book) => {
          return book.id === item.id;
        });

        const bsDiv = document.createElement("div");
        bsDiv.classList.add("bestContainer");
        bsDiv.innerHTML = `
        <div class="bestDiv">
          <div class="overflowBS">
            <img class="bestBookImg" src="${item.imageURL}" alt="">
          </div>
          <div class="bestDetail" id='bestDetail'>
            <h1 class="bestHeader">Best Selling</h1>
            <hr class="bestLine">
            <div>
              <p class="bestBookAuthor">by ${item.author}</p>
              <h2 class="bestBookHeader">${item.name}</h2>
              <p class="bestDes">${val.des}.</p>
            </div>
            <p class="bestPrice">$24.00</p>
          </div>
        </div>
        `;
        document.getElementById("bestSellingBook").appendChild(bsDiv);
        bsDiv.addEventListener("click", () => {
          auth.onAuthStateChanged((user) => {
            db.ref("users/" + user.uid)
              .update({ bookId: item.id })
              .then(() => {
                window.location.href = "./book.html";
              })
              .catch((e) => {
                console.log(e);
              });
          });
        });
      }
      bookDet();
    });
  } catch (error) {
    console.log(error);
  }
}

genreAPI();
//--------------------------------------------------
function profileDrop() {
  document.getElementById("profileDropdown").style.display = "block";
}

function profileOut() {
  document.getElementById("profileDropdown").style.display = "none";
}

document.getElementById("logOutBtn").addEventListener("click", () => {
  auth
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
  window.location.reload();
});

document.querySelector(".gotoProfile").addEventListener("click", () => {
  window.location.href = "./user/profile.html";
});

document.querySelector(".gotoSetting").addEventListener("click", () => {
  window.location.href = "./user/edit.html";
});

document.querySelector(".gotoWishlist").addEventListener("click", () => {
  window.location.href = "./user/wishlist.html";
});

document.querySelector(".gotoCart").addEventListener("click", () => {
  window.location.href = "./user/cart.html";
});

document.querySelector(".dcm").addEventListener("click", () => {
  window.location.href = "./feature.html";
});
