/***********************************************************************
*
* DESCRIPTION :
*       Database model for last visited.
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		20 Jan 2015
*
* CHANGES :
*
**/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var IRXLastVisitedSchema =new mongoose.Schema({
	id:{type:String},
   lastVisited :[{type:String,name:String,url:String,date:Date}],
   data : Schema.Types.Mixed
});

IRXLastVisitedModel = mongoose.model('irxlastvisited', IRXLastVisitedSchema);
module.exports = IRXLastVisitedModel;