let mongoose = require('mongoose')

let familyCircleSchema = new mongoose.Schema({
    familyName: {
        type:  String,
        required: true
    },
    creatorId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    familyToken:{ 
        type: String,
        required: true,
        minlength: 8
    },
    countryOrigin: String,
    familyStory: String,
    members: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    familyRecipes: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }]
})


module.exports = mongoose.model('FamilyCircle', familyCircleSchema)