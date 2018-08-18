var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema ( {
    fullname: {type:String, required:  true},
    address: {type:String, required: true},
    email: {type: String, required: true},
    phone: {type:String, required: true},
    password: {type:Number, required: true}
});
module.exports =mongoose.model('User',userSchema);