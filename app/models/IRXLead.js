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
   leadId:{type:String,required:true},//from irxleadreview
   type:{type:String,required:true},
   createdOn:{type:Date},
   updatedOn:{type:Date}
});

IRXLeadsModel = mongoose.model('irxlead', IRXLeadsSchema);
module.exports = IRXLeadsModel;