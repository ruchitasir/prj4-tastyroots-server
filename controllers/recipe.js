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
            db.User.updateOne({_id: req.body.creatorId},
                {$push: {recipes: recipe._id}} )
            .then((updatedUser)=>{
                    console.log('req.body.shared',req.body.sharedWith)
                    if(req.body.sharedWith){
                        console.log('it is not empty') 
                        db.FamilyCircle.updateMany(  {_id: {$in: req.body.sharedWith}}, 
                            {$push: {familyRecipes: recipe}})
                        .then((updatedFamilyCircles)=>{
                            res.send(recipe)            
                        })
                        .catch((err) => {
                            console.log("Error in post /recipe route, updating the family circle :",err)
                        })
                    }
                    else{
                        console.log('sharedWith is empty')
                        res.send(recipe)
                    }
            })
            .catch((err) => {
                console.log("Error in post /recipe route, updating the user to have this recipe :",err)
            })   
        })
        .catch((err) => {
            console.log("Error in post /recipe route:",err)
        })
})

/*****************************
 * PUT ROUTES
 ****************************/

/**
 * PUT  
 * Edits an existing recipe to the database.
 * @returns A recipe with a specific id
 * @param id, recipe id
 */
router.put('/:id', (req, res) => {
    console.log('put recipe BODY:',req.body)  
    // Parse the ingredients from req.body.ingredients array 
    // Assuming each ingredient is a string of form: '2,ounce,butter'
    ingredientsArray = req.body.ingredients
    ingredients = ingredientsArray.map((ingredient)=>{
        ingredientSplit = ingredient.split(',')
        return {qty: ingredientSplit[0], unit:ingredientSplit[1] , name:ingredientSplit[2] }
    })

    db.Recipe.updateOne({_id:req.params.id}, {          
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
        res.send(recipe)
    })
    .catch((err) => {
        console.log("Error in put /recipe/:id:",err)
    })
})


/**
 * PUT  
 * Edits an existing recipe to make it shared with family circle or unshare from a family circle
 * @returns A recipe with a specific recipe id
 * @param id, recipe id
 */
router.put('/sharedWith/:id', (req, res) => {
    console.log('put sharedWith recipe BODY:',req.body) 
    console.log('req.body.shared',req.body.sharedWith) 
     // removes all the family circles to which this recipe has been previously shared
    db.Recipe.updateOne({_id:req.params.id}, {  
        $set: { sharedWith: [] }
    })
    .then((recipe) => {
        // find all the family circles which contains this recipe and update them to not have this recipe
        db.FamilyCircle.updateMany({familyRecipes: req.params.id},{
            $pullAll: {familyRecipes: [req.params.id]}
        })
        .then((updatedFamilyCircles=>{
             // add new family circles that user has chosen for sharing, in the recipe
            if(req.body.sharedWith){
                db.Recipe.updateOne({_id:req.params.id},req.body)
                .then((fullyUpdatedRecipe)=>{
                    // add/update the family circles user has sent in req.body.sharedWith,  with this recipe again
                    db.FamilyCircle.updateMany({_id: {$in: req.body.sharedWith}}, 
                        {$push: {familyRecipes: fullyUpdatedRecipe}})
                    .then((updatedFamilyCircles)=>{
                        res.send(fullyUpdatedRecipe)            
                    })
                    .catch((err) => {
                        console.log("Error in post /recipe route, updating the family circle with recipe :",err)
                    })
                })
                .catch((err) => {
                    console.log("Error in put /recipe/sharedWith/:id: while updating the recipe with family circles",err)
                }) 
            } else {
                console.log('sharedWith is empty in put /recipe/sharedWith/:id')
                //user has unshared this recipe with all the family circles
                res.send(recipe)
            }
        }))
        .catch((err) => {
            console.log("Error in put /recipe/sharedWith/:id in removing the recipes from the family circles :",err)
        })
    })
    .catch((err) => {
        console.log("Error in put /recipe/sharedWith/:id: in removing the family circles from the recipe",err)
    }) 
    
})

module.exports = router