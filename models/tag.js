let mongoose = require('mongoose')

let tagSchema = new mongoose.Schema({
    name: String
})

module.exports = mongoose.model('Tag', tagSchema)