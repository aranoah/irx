/***********************************************************************
*
* DESCRIPTION :
*       Database model for claims on profile.
*  
* Copyright :
*     Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*     Puneet (puneet@aranoah.com)      
*
* START DATE :    
*     12 Feb 2014
*
* CHANGES :
*
**/
var mongoose = require('mongoose');

var IRXProfileClaimSchema =new mongoose.Schema({
   id:{type:String,required:true},
   claimerId :{type:String,required:true},
   profileId :{type:String,required:true},
   date :{type:String,required:true}
})

IRXProfileClaimModel = mongoose.model('irxprofileclaim', IRXProfileClaimSchema);
module.exports = IRXProfileClaimModel;