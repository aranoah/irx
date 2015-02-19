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
var defPage = CONSTANTS.def_page;
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
function AgentListingService(){    
	baseService.call(this);
}
AgentListingService.prototype.__proto__=baseService.prototype ;

AgentListingService.prototype.listAgents = function(data){
	var _selfInstance = this;
	var query = {};
	var filters = data.filters;
	var page = data.page;
	if(!page) {
		page=defPage;	
	}
	if(filters && filters.city != null &&  filters.city != "") {
		console.log("qwerty",filters.city)
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
	if(filters && filters.name != null &&  filters.name != "") {

		query["name"]={ $regex: filters.name, $options: 'i' };
	}
	query["type"]="agent";
	var start = page.start;
	var pageSize = Number(page.pageSize)+1;
	
	IRXUserProfileModel.find(query,{},{skip:start,limit:pageSize},function(err , result){
		if(err){
			console.error(err)
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		}else{
			if(data != null){
				if(page.start == 0){
					IRXUserProfileModel.count(query, function(err, count) {
						if(err){

						}else{
							page['total']=count;
								_selfInstance.processPagenation(result,page)
							_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.code.msg,result,page);
						}
					});
				}else{
						_selfInstance.processPagenation(result,page)
						_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.code.msg,result,page);
				}
			
			}
			else {
				console.log("Agent data not found")
				_selfInstance.emit("done",404,"Project data not found","Project data not found",null);
			 			
			}
		}
	})
}
module.exports = AgentListingService;