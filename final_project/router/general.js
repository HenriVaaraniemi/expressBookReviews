const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password){
      users.push({"username":username,"password":password});
      res.send("created user " + username);
  }
  else{
      res.send("something went wrong");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
    res.send(JSON.stringify(books,null,4));
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const pituus = Object.keys(books).length;
  var searchResult = [];
  for (var i = 0; i<pituus; i++){
    if (author == books[(i+1)].author){
        searchResult.push(books[i+1])
        
    }

  };
  res.send(searchResult);
  
  //res.send(books[(1+1)].author);
  //res.send(author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const pituus = Object.keys(books).length;
    var searchResult = [];
    for (var i = 0; i<pituus; i++){
      if (title == books[(i+1)].title){
          searchResult.push(books[i+1])
          
      }
  
    };
    res.send(searchResult);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

// getting list using Promise callbacks

function getBooksPromise() {
    return new Promise((resolve, reject)=> {
        setTimeout(() => {
            const bookList = Object.values(books);
            resolve(bookList);
        }, 1000);
    });
}

getBooksPromise().then((books) => {
    console.log("list of books: ", books);
})

//getting the book details based on ISBN

function getBooksISBN(isbn) {
    return new Promise((resolve, reject)=> {
        setTimeout(() => {
            const bookList = books[isbn];
            if (bookList){
                resolve(bookList);
            }
            else { reject(new Error("book not found"));
        }
            
        }, 1000);
    });
}

getBooksISBN(3).then((book) =>{
    console.log("book found: ", book)
})

//get books based on author

function getBooksAuthor(author) {
    return new Promise((resolve, reject)=> {
        setTimeout(() => {
            const bookList = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
            if (bookList.length >0){
                resolve(bookList);
            }
            else { reject(new Error("book not found"));
        }
            
        }, 1000);
    });
}

getBooksAuthor("Unknown").then((bookList) =>{
    console.log("Books by author: ", bookList)
})

// get books based on title

function getBooksTitle(title) {
    return new Promise((resolve, reject)=> {
        setTimeout(() => {
            const bookList = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
            if (bookList.length >0){
                resolve(bookList);
            }
            else { reject(new Error("book not found"));
        }
            
        }, 1000);
    });
}

getBooksTitle("Fairy Tales").then((bookList) =>{
    console.log("Books with title: ", bookList)
})
module.exports.general = public_users;
