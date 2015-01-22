/***********************************************************************
*
* DESCRIPTION :
*       Database model for verification codes.
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		11 Nov 2014
*
* CHANGES :
*
**/
var mongoose = require('mongoose');

var IRXVerificationSchema =new mongoose.Schema({
   id:{type:String,required:true},
   userId:{type:String,reqired:true},
   vfCode:{type:String,reqired:true},
   vfData :{type:String},
   type : {type:String,required:true},
   createdOn:{type:Date},
   updatedOn:{type:Date},
   emailId :{type:String},
   phoneNum :{type:String}
});

IRXVerificationModel = mongoose.model('irxverification', IRXVerificationSchema);
module.exports = IRXVerificationModel;
