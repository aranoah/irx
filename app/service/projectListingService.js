/***********************************************************************
*
* DESCRIPTION :
*       Service class for agent listing related functionalities
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		17 Dec 2014
*
* CHANGES :
*
**/
var CONSTANTS = require(_path_util+'/constants');
var mongoErr = require(_path_util+'/mongo-error')
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js");
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var IRXVerificationModel = require(_path_model+"/IRXVerification");
var IRXProductLineModel = require(_path_model+"/IRXProductLine");
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");
var emailUtils = require(_path_util+"/email-utils.js");
var emailTemplates = require('email-templates');

var properties = require(_path_env+"/properties.js");
var baseService = require(_path_service+"/base/baseService");

var mongoose = require('mongoose');
function ProjectListingService(){    
	baseService.call(this);
}
ProjectListingService.prototype.__proto__=baseService.prototype ;

ProjectListingService.prototype.listProjects = function(data){
	var _selfInstance = this;
	var query = {};
	var filters = data.filters;
	var page = data.page;
	if(!page) {
		page = {
			start:0,
			pageSize:3	
		}
		
	}
	if(filters && filters.city != null &&  filters.city != "") {
		query["location.city"]=filters.city;
	}
	if(filters && filters.type != null &&  filters.type != "") {
		query["type"]=filters.type;
	}
	if(filters && filters.bhk != null &&  filters.bhk != "") {
		query["bhk"]=filters.bhk;
	}
	if(filters && filters.budget != null && filters.budget != "") {
		query["price"]=filters.budget;
	}
	var start = page.start;
	var pageSize = Number(page.pageSize)+1;
	console.log(query)
	IRXProductLineModel.find(query,{},{skip:start,limit:pageSize},function(err , result){
		if(err){
			console.error(err)
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		}else{
			if(data != null){
				_selfInstance.processPagenation(result,page)
				_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.code.msg,result,page);
			}
			else {

			}
		}
	})
}
module.exports = ProjectListingService;