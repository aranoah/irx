/***********************************************************************
*
* DESCRIPTION :
*       Database model for agent and product mapping.
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
var Schema = mongoose.Schema;
var IRXAgentMProductSchema =new mongoose.Schema({
   id:{type:String,required:true},
   agentId:{type:String,required:true},
   project:{type:Array,required:true},
   location:{type:Array,required:true},
   rank:{type:Number},//indexing
   preferred:{type:Boolean},
   createdOn:{type:Date},
   updatedOn:{type:Date},
   distress: Schema.Types.Mixed
});

IRXAgentMProductModel = mongoose.model('irxagentmproduct', IRXAgentMProductSchema);
module.exports = IRXAgentMProductModel;