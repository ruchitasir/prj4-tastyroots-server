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
    .populate('familyRecipes')
    .populate('members')
    .populate('creatorId')
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
    //check uniqueness of family token
    db.FamilyCircle.findOne({ familyToken: req.body.familyToken })
        .then((family) => {
            if (family) {
                return res.status(409).send({ message: 'Family token is in use' })
            }
            db.FamilyCircle.create(req.body)
            .then((f) => {
                db.User.updateOne({ _id: req.user._id },
                    {$push: {
                        families: {_id: f._id,
                            userRole: "creator"
                        }
                    }
                })
                .then((updatedUser) => {
                    console.log("user created family circle", updatedUser)
                    res.send({updatedUser})
                })
                .catch(innerErr => {
                    console.log("Error in creating a new family circle", innerErr)
                    if (innerErr.name === 'ValidationError') {
                        res.status(412).send({ message: `Validation Error! ${innerErr.message}.` })
                    } else {
                        res.status(500).send({ message: 'Error creating family circle' })
                    }
                })
            })
            .catch((inErr) => {
                console.log("Error in creating a new family circle:", inErr)
                if (inErr.name === 'ValidationError') {
                    res.status(412).send({ message: `Validation Error! ${inErr.message}.` })
                } else {
                    res.status(500).send({ message: 'Error creating family circle' })
                }
        })
        .catch((err) => {
            console.log("Error in creating a new family circle:", err)
            res.status(503).send({message: 'Database or server error'})
        })
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
    db.FamilyCircle.findOneAndUpdate({ familyToken: req.body.familyToken },
        {$push: {members: { _id: req.user._id }}}, 
        {useFindAndModify: false})
        .then((f) => {
            db.User.updateOne({ _id: req.user._id },
                {$push: {
                    families: {_id: f._id,
                        userRole: "member"
                    }
                }
            })
            .then((updatedUser) => {
                console.log("user joined family circle", updatedUser)
                res.send({updatedUser})
            })
            .catch(innerErr => {
                console.log("Error in joining a family circle", innerErr)
                res.status(500).send({ message: 'Error in joining a family circle' })
                })
        })
        .catch((err) => {
            console.log("Error in joining family circle:", err)
            res.status(400).send({ message: "Please check your family token." })
        })

})


module.exports = router