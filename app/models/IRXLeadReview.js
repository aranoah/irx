/***********************************************************************
*
* DESCRIPTION :
*       Database model for lead reviews. Once a lead is reviewed and verified
*       it is inserted to IRXLead collection.
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

var IRXLeadReviewSchema =new mongoose.Schema({
   id:{type:String,required:true},
   projectId:{type:String,required:true},
   agentId: {type:String,required:true},
   name:{type:String,required:true},
   mobileNo:{type:String,required:true},
   emailId:{type:String,required:true},
   type:{type:String,required:true},
   createdOn:{type:Date},
   updatedOn:{type:Date},
   status:{type:String},
   reviewedBy:{type:String}
});

IRXLeadReviewModel = mongoose.model('irxleadreview', IRXLeadReviewSchema);
module.exports = IRXLeadReviewModel;