let router = require('express').Router()
let db = require('../models')



/*****************************
 * GET ROUTES
 ****************************/
//**
// * GET
//* Returns all current user info
router.get('/', (req, res) => {
  db.User.findById(req.user._id)
    .populate('recipes')
    .populate({path: 'families._id', model:'FamilyCircle'})
    .then((u) => {
      console.log(u)
      res.send(u)
    })
    .catch((err) => {
      console.log("ERROR in user get route", err)
    })
})

/*****************************
 * PUT ROUTE
 ****************************/
//**
//* PUT
// updates user profile like picture and bio but not email, password, firstname and lastname
router.put('/', (req, res) => {
  db.User.updateOne({ _id: req.user._id }, req.body)
    .then((u) => {
      res.send(u)
    })
    .catch((err) => {
      res.send("Error:", err)
    })
})

module.exports = router