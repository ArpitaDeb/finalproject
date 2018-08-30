var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); //use to hash password
var userSchema = new Schema ( {
    //fullname: {type:String, required:  true},
   // address: {type:String, required: true},
    email: {type: String, required: true},
   // phone: {type:String, required: true},
    password: {type:String, required: true}
});
//encrypt password
userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};
//check if password matches with hashed password.
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};
module.exports =mongoose.model('User',userSchema);