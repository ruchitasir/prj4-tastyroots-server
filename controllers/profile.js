let router = require('express').Router()
let db = require('../models')
var jwt = require('jsonwebtoken');
// var mongoose_1 = __importDefault(require("mongoose"));


/*****************************
 * GET ROUTES
 ****************************/
//**
// * GET
//* Returns all current user info
router.get('/', (req, res) => {
  db.User.findById(req.user._id)
    .populate('recipes', 'families')
    .then((u) => {
      console.log(u)
      res.send(u)
    })
    .catch((err) => {
      res.status(500).send("Error:", err)
    })
})

/*****************************
 * PUT ROUTE
 ****************************/
//**
//* PUT
// updates user profile
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