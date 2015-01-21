/***********************************************************************
*
* DESCRIPTION :
*       Database model for users.
*  
* Copyright :
*     Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*     Puneet (puneet@aranoah.com)      
*
* START DATE :    
*     11 Nov 2014
*
* CHANGES :
*
**/
var mongoose = require('mongoose');

var IRXUserProfileSchema =new mongoose.Schema({
   id:{type:String,required:true},
   name:{type:String,required:true},
   irxId:{type:String,required:true},
   userId:{type:String,required:true,unique:true},
   password:{type:String,required:true},
   location:{city:String,state:String,country:String,name:String,pincode:String,lat:Number,lon:Number},
   locationProjects:{type:Array},
   type:{type:String,required:true},
   companyName: {type:String},
   imageUrl:{type:String},
   specialities :{type:Array},
   roles: {type:Array},
   permission: {type:Array},
   rank:{type:Number},//indexing
   preferred:{type:Boolean},
   createdOn:{type:Date},
   updatedOn:{type:Date},
   status:{type:String},
   phoneNum :{type:String},
   projectCounter :{type:Number},
   hasDistress : {type:Boolean}
});

IRXUserProfileModel = mongoose.model('irxuser', IRXUserProfileSchema);
module.exports = IRXUserProfileModel;