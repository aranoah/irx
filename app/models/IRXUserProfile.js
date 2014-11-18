var mongoose = require('mongoose');

var IRXUserProfileSchema =new mongoose.Schema({
   name:{type:String,required:true},
   userId:{type:String,required:true},
   password:{type:String,required:true},
   location:{city:String,state:String,country:String,name:String,pincode:String,lat:Number,lon:Number},
   type:{type:String,required:true},
   companyName: {type:String},
   imageUrl:{type:String},
   specialities :{type:Array},
   roles: {type:Array},
   permission: {type:Array}
});

IRXUserProfileModel = mongoose.model('IRXUserProfile', IRXUserProfileSchema);
module.exports = IRXUserProfileModel;