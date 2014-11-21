/***********************************************************************
*
* DESCRIPTION :
*       Database model for broker information and configuration
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

var IRXBrokerInfoSchema =new mongoose.Schema({
   
   agentId: {type:String,required:true},
   packagePlan : {type:String,required:true}//id of project plan
   createdOn:{type:Date},
   updatedOn:{type:Date}
});

IRXBrokerInfoModel = mongoose.model('irxbrokerinfo', IRXBrokerInfoSchema);
module.exports = IRXBrokerInfoModel;