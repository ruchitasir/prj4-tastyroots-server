let bcrypt= require('bcryptjs')
let mongoose = require('mongoose')

//  Create user schema
let userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: String,
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 6
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    pic: String,
    admin:{
        type: Boolean,
        default: false
    }

})

  // Hash the password with Bcrypt
  userSchema.pre('save',function(done){
        // Make sure it's new, as opppsed to modified
        if(this.isNew){ 
            this.password = bcrypt.hashSync(this.password,12)
        }
        // Indicate that we are okay to move on (to insert into the DB)
        done()
  })  


// Make a JSON representation of the user (for sending on the JWT payload)
  userSchema.set('toJSON',{
      transform: (doc,user)=>{
            delete user.password
            delete user.__v
            return user
      }
  })


// Make a function that compares passwords
userSchema.methods.validPassword= function (typedPassword) {
    // typedPassword: Plain text, just typed in by user
    // this.password: Existing, hashed password1`
    return bcrypt.compareSync(typedPassword, this.password)
}

// Export user model
module.exports = mongoose.model('User',userSchema)