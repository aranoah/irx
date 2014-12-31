/***********************************************************************
*
* DESCRIPTION :
*       Database model for leads.
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

var IRXLeadsSchema =new mongoose.Schema({
	id:{type:String,required:true},
   projectId: {type:String,required:true},
   agentId: {type:String},
   name: {type:String,required:true},
   mobileNo: {type:String,required:true},
   emailId: {type:String,required:true},
   type: {type:String,required:true},
   createdOn: {type:Date},
   updatedOn: {type:Date},
   status: {type:String},
   reviewedBy: {type:String},
   note:{type:String}
});

IRXLeadsModel = mongoose.model('irxlead', IRXLeadsSchema);
module.exports = IRXLeadsModel;