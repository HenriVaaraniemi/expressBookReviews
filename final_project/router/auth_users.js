const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    console.log(users);
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("User successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
      }
    });


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.review;
  const isbn = req.params.isbn
  const username = req.session.authorization.username;

  if (isbn && review){
      books[isbn].reviews = {review, username};
      console.log(books[isbn]);
      return res.status(300).json({message: "Review posted"});
  }
  else{
      res.send("in the else");
  }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn
  
    if (isbn && username){
        delete books[isbn].reviews;
        return res.status(300).json({message: "Review deleted"});
    }
    else{
        res.send("in the else");
    }
    
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
