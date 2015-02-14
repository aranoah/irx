/***********************************************************************
*
* DESCRIPTION :
*       Database model for reviews,likes ,rating etc
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

var IRXReviewSchema =new mongoose.Schema({
   id:{type:String,required:true},
   msg:{type:String,required:true},
   parentId:{type:String,required:true},// Who is being reviewed
   agentId: {type:String,required:true},//Who is reviewing
   agentName:{type:String,required:true},
   agentImage :{type:String},
   likeCount:{type:Number},
   likedByUser:[{userId:String}],
   ratingByUser:[{userId:String,rating:Number}],
   rating:{type:Number},
   ratingCount:{type:Number},
   updatedOn:{type:Date},
   postedOn:{type:Date}
  
});

IRXReviewModel = mongoose.model('irxreview', IRXReviewSchema);
module.exports = IRXReviewModel;