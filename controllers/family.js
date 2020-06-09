let router = require('express').Router()
let db = require('../models')

/*****************************
 * GET ROUTES
 ****************************/
/**
 * GET
 * @returns A single family circle in the db
 * @param id, The id of the family circle to return 
 */
router.get('/:id', (req, res) => {
    db.FamilyCircle.findById(req.params.id)
        .then((f) => {
            res.send(f)
        })
        .catch((err) => {
            console.log("Error in family route:", err)
        })
})

/*****************************
 * POST ROUTES
 ****************************/
/**
 * POST
 * Creates a new family circle
 */
router.post('/', (req, res) => {
    db.FamilyCircle.create(req.body)
        .then((nf) => {
            db.User.updateOne({ _id: req.user._id},
                { $push: { families: {_id: nf._id, 
                        userRole: "creator"
                    }}
                })
                .then((updatedUser) => {
                    console.log("user joined family circle", updatedUser)
                })
                .catch((err) => {
                    console.log("Error in updating user when creating family:", err)
                })
            res.send(nf)
        })
        .catch((err) => {
            console.log("Error in creating new family circle:", err)
        })
})

/*****************************
 * PUT ROUTES
 ****************************/
/**
 * PUT 
 * Join family circle
 */
router.put('/', (req, res) => {
    db.FamilyCircle.updateOne({_id: req.body._id, 
        familyToken: {$eq: req.body.familyToken }},
        {$push: {members: {_id: req.user._id}
    }})
    .then((f) => {
        console.log('joined family', f)
        res.send(f)
    })
    .catch((err) => {
        console.log("Error in joining family circle:", err)
        res.status(400).send({message: "Please check your family token."})
    })

})


module.exports = router