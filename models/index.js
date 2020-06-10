let mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tastyroots', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

module.exports.Recipe = require('./recipe')
module.exports.FamilyCircle = require('./familyCircle')
module.exports.User = require('./user')
module.exports.Tag = require('./tag')