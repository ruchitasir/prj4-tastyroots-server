let router = require('express').Router()
let db = require('../models')

/*****************************
 * GET ROUTES
 ****************************/

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
        console.log("Error in get /recipe route:",err)
    })
})

/**
 * GET
 * @returns All recipes in the db which are public
 */
router.get('/public', (req, res) => {
    db.Recipe.find({public: true})
    .then((recipes)=>{
        res.send(recipes)
    })
    .catch((err) => {
        console.log("Error in get /recipe/public route:",err)
    })
})

/**
 * GET
 * @returns The recipe in the db with a particular recipe id
 * @param id, The id of the recipe to return
 */
router.get('/:id', (req, res) => {

    db.Recipe.findOne({_id:req.params.id})
    .then((r) => {
        res.send(r)
    })
    .catch((err) => {
        console.log("Error in get /recipe/:id route:",err)
    })
})

<<<<<<< HEAD
=======
/**
 * GET
 * @returns All the recipes in the db which belongs to a particular user (user-id)
 * @param userid, The id of the user to return
 */
router.get('/user/:id', (req, res) => {
    db.Recipe.find({creatorId:req.params.id})
    .then((recipes) => {
        res.send(recipes)
    })
    .catch((err) => {
        console.log("Error in get /recipe/user/:id route:",err)
    })
})


/*****************************
 * POST ROUTES
 ****************************/

/**
 * POST 
 * Adds a new recipe to the database.
 */
router.post('/',(req,res)=>{
        console.log('post recipe BODY:',req.body)
        
        // Parse the ingredients from req.body.ingredients array 
        // Assuming each ingredient is a string of form: '2,ounce,butter'
        ingredientsArray = req.body.ingredients
        ingredients = ingredientsArray.map((ingredient)=>{
            ingredientSplit = ingredient.split(',')
            return {qty: ingredientSplit[0], unit:ingredientSplit[1] , name:ingredientSplit[2] }
        })

        // 1.Create recipe

        // 2. check sharedWith if it is empty or null and if not then
        // use the family ids and for each family circle id, add recipe to that family circle array
        
        // 3. add it to the user collection of recipes
        db.Recipe.create({          
            recipeName: req.body.recipeName,
            originalRecipe: req.body.originalRecipe,
            description: req.body.description,  
            creatorId:  req.body.creatorId,
            servings: req.body.servings,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            ingredients: ingredients,
            steps: req.body.steps,
            pictures: req.body.pictures,
            sharedWith : req.body.sharedWith,
            public: req.body.public,      
        })
        .then((recipe) => {
            console.log('req.body.shared',req.body.sharedWith)
            if(req.body.sharedWith){
                console.log('it is not empty') 
                db.FamilyCircle.updateMany(  {_id: {$in: sharedWith}}, 
                    {$push: {familyRecipes: recipe}})
                .then((updatedFamilyCircles)=>{
                    db.User.updateOne({_id: req.body.creatorId},
                        {$push: {recipes: recipe._id}} )
                    .then((updatedUser)=>{
                        res.send(recipe)
                    })
                    .catch((err) => {
                        console.log("Error in post /recipe route, updating the user to have this recipe :",err)
                    })    
                })
                .catch((err) => {
                    console.log("Error in post /recipe route, updating the family circle :",err)
                })
             }
             else{
                 console.log('sharedWith is empty')
             }
        })
        .catch((err) => {
            console.log("Error in post /recipe route:",err)
        })
})
>>>>>>> 538493bb7f8fd70d660cfec323b64ba842fe85ee



module.exports = router