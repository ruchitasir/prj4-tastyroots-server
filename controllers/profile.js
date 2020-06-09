let router = require('express').Router()
let db = require('../models')

// NOTE: User should be logged in to access this route
router.get('/', (req, res) => {
  db.User.findById(req.user._id)
    .then((u) => {
      res.send(u)
    })
})


module.exports = router