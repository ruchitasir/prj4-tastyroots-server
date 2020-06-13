let mongoose = require('mongoose')

let ingredientSchema = new mongoose.Schema({
    qty: Number,
    unit: String,
    name: String
})


let recipeSchema = new mongoose.Schema({
    recipeName:{
        type: String,
        required: true
    },
    originalRecipe: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    description: String,
    datePosted : {
        type: Date,
        default : Date.now
    },
    creatorId:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    servings: Number,
    prepTime: String,
    cookTime: String,
    ingredients: [ingredientSchema],
    steps: [String],
    pictures: [String],
    sharedWith: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'FamilyCircle'
    }],
    recipePublic: {
        type: Boolean,
        default: false
    },
    tags: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]
    


})

module.exports = mongoose.model('Recipe', recipeSchema)