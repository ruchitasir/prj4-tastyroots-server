let router = require('express').Router()
let db = require('../models')

/**
 * GET
 * @returns All recipes in the db
 */
router.get('/', (req, res) => {
    db.Recipe.find()
    .then((r)=>{
        res.send(r)
    })
    .catch((err) => {
        console.log("Error:",err)
    })
})

/**
 * GET
 * @returns All recipes in the db
 * @param id, The id of the recipe to return
 */
router.get('/:id', (req, res) => {

    db.Recipe.findOne({_id:req.params.id})
    .then((r) => {
        res.send(r)
    })
    .catch((err) => {
        console.log("Error:",err)
    })
})




module.exports = router