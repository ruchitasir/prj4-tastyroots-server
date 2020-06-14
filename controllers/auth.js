require('dotenv').config()
let db = require('../models')
let jwt = require('jsonwebtoken')
let router = require('express').Router()

// POST /auth/login (find and validate user; send token)
router.post('/login', (req, res) => {
  console.log(req.body)
  db.User.findOne({ email: req.body.email })
    .then(user => {
      // Check whether the user exists
      if (!user) {
        // They don't have an account, send error message
        return res.status(404).send({ message: 'User was not found' })
      }
      // They exist but make sure they have a correct password
      if (!user.validPassword(req.body.password)) {
        // Incorrect password, send error back
        return res.status(401).send({ message: "Invalid credentials" })
      }
      // We have a good user - make them a new token, send it to them
      let modifiedUser = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
      // User exists, so create a token for the new user
      let token = jwt.sign(modifiedUser, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 8 // 8 hours, in seconds
      })
      res.send({ token })
    })
    .catch(err => {
      console.log("Error in POST /auth/login", err)
      res.status(503).send({ message: "Server-side or DB server" })
    })
})


// POST to /auth/signup (create user; generate token)
router.post('/signup', (req, res) => {
  console.log(req.body)
  // Look up the User by email to make sure that the User is new
  db.User.findOne({ email: req.body.email })
    .then(user => {
      // If a user exists already then do NOT let them create another account
      if (user) {
        // No no! Sign up
        return res.status(409).send({ message: 'Email address in use' })
      }
      //We know the user is legitimately a new user so create new user account
      db.User.create(req.body)
        .then(newUser => {
          let modifiedUser = {
            _id: newUser._id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email
          }
          // User exists, so create a token for the new user
          let token = jwt.sign(modifiedUser, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 8 // 8 hours, in seconds
          })
          res.send({ token })
        })
        .catch(innerErr => {
          console.log("Error creating a new user", innerErr)
          if (innerErr.name === 'ValidationError') {
            res.status(412).send({ message: `Validation Error! ${innerErr.message}.` })
          } else {
            res.status(500).send({ message: 'Error creating user' })
          }
        })
    })
    .catch(err => {
      console.log("Error in post /auth/signup when checking if the user already exists,err")
      res.status(503).send({ message: 'Database or server error' })
    })

})



module.exports = router
