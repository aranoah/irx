/***********************************************************************
*
* DESCRIPTION :
*       Database model for reviews invitation
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

var IRXReviewInvitationSchema =new mongoose.Schema({
   id:{type:String,required:true},
   msg:{type:String},
   parentId:{type:String,required:true},// Who is sending invitation
   targetId: {type:String,required:true},// To whom invitation is being sent
   name:{type:String},
   refCode : {type:String,required:true},
   updatedOn:{type:Date},
   postedOn:{type:Date}
  
});

IRXReviewInvitationModel = mongoose.model('irxreviewinvitation', IRXReviewInvitationSchema);
module.exports = IRXReviewInvitationModel;