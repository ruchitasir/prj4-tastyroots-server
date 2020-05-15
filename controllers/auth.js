require('dotenv').config()
let db = require('../models')
let jwt = require('jsonwebtoken')
let router = require('express').Router()

// POST /auth/login (find and validate user; send token)
router.post('/login', (req, res) => {
  console.log(req.body)
  res.send('STUB POST /auth/login')
})

// POST to /auth/signup (create user; generate token)
router.post('/signup', (req, res) => {
  console.log(req.body)
  // Look up the User by email to make sure that the User is new
  db.User.findOne({email: req.body.email})
  .then(user=>{
    // If a user exists already then do NOT let them create another account
    if(user){
      // No no! Sign up
      return res.status(409).send({message: 'Email address in use'})
    }
     //We know the user is legitimately a new user so create new user account
      db.User.create(req.body)
      .then(newUser=>{
        // User exists, so create a token for the new user
        let token = jwt.sign(newUser.toJSON(),process.env.JWT_SECRET,{
            expiresIn: 120 // 60 * 60* 8 // 8 hours, in seconds
        })
        res.send({token})
      })
      .catch(innerErr=>{
        console.log("Error creating a new user",innerErr)
        if(innerErr.name=== 'ValidationError'){
          res.status(412).send({message: `Validation Error! ${innerErr.message}.`})
        }else{
          res.status(500).send({message: 'Error creating user'})
        }
        
      })
  })
  .catch(err=>{
    console.log("Error in post /auth/signup when checking if the user already exists,err")
    res.status(503).send({message: 'Database or server error'})
  })

})

// NOTE: User should be logged in to access this route
router.get('/profile', (req, res) => {
  // The user is logged in, so req.user should have data!
  // TODO: Anything you want here!

  // NOTE: This is the user data from the time the token was issued
  // WARNING: If you update the user info those changes will not be reflected here
  // To avoid this, reissue a token when you update user data
  res.send({ message: 'Secret message for logged in people ONLY!' })
})

module.exports = router
