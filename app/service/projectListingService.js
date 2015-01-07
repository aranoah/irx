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
		page = defPage;
		
	}
	if(filters && filters.city != null &&  filters.city != "") {
		query["location.city"]=filters.city;
	}
	if(filters && filters.type != null &&  filters.type != "") {
		query["type"]=filters.type;
	}
	if(filters && filters.bhk != null &&  filters.bhk != "") {
		query["bhk"]=Number(filters.bhk);
	}
	if(filters && filters.budget != null && filters.budget != "") {
		query["price"]=filters.budget;
	}
	if(filters && filters.name != null &&  filters.name != "") {
		query["name"]=filters.name;
	}
	var start = page.start;
	var pageSize = Number(page.pageSize)+1;
	
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
				console.log("Project data not found")
				_selfInstance.emit("done",404,"Project data not found","Project data not found",null);
			 			
			}
		}
	})
}

ProjectListingService.prototype.listProjectsElastic = function(data) {  
  var _selfInstance = this;
  //var text = this.req.params.text;
  var query = new Array();
	var filters = data.filters;
	var page = data.page;
	if(!page) {
		page = defPage;
		
	}
	if(filters && filters.city != null &&  filters.city != "") {
		//query.push(location={city:filters.city};
			var match = {
			"match":{
				"location":{"city":filters.city}
			}
		}
		query.push(match);
		
	}
	if(filters && filters.type != null &&  filters.type != "") {
		var match = {
			"match":{
				"type":Number(filters.type)
			}
		}
		query.push(match);
	}
	if(filters && filters.bhk != null &&  filters.bhk != "") {
		var match = {
			"match":{
				"bhk":Number(filters.bhk)
			}
		}
		query.push(match);
	}
	if(filters && filters.budget != null && filters.budget != "") {
		query.price=filters.budget;
	}
	if(filters && filters.name != null &&  filters.name != "") {
		var match = {
			"match":{
				"name":filters.name
			}
		}
		query.push(match);
	}
	
	if(query.length==0){
		query={match_all:query}
	}
	var start = page.start;
	var pageSize = Number(page.pageSize)+1;
	var order= "asc";
	if(filters.sortOrder && filters.sortOrder != null && filters.sortOrder!=""){
		order=filters.sortOrder;
	}
    _app_context.esClient.search({
    index: 'irx_schema',
    type:"irx-eproduct",
    body: {
      query: {bool:{must:query}},
      from:start,
      size:pageSize,
      sort:{ "price" : {"order" : order}}
    }
  }).then(function (resp) {
    var hits = resp.hits.hits;
   
    var renderingData = new Array();
    for(var i =0;i<hits.length; i++){
        renderingData.push(hits[i]._source)
    }
  
    _selfInstance.processPagenation(renderingData,page)
   _selfInstance.emit("done",STATUS.OK.code,STATUS.OK.code.msg,renderingData,page);
}, function (err) {
  _selfInstance.emit("done",404,"Project data not found","Project data not found",null);
});
}
module.exports = ProjectListingService;