/***********************************************************************
*
* DESCRIPTION :
*       Agent controller for listing agents
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
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var commonValidator = require(_path_util+"/commonValidator")
var projectController = new Controller();

var projectListingService = require(_path_service+"/projectListingService.js" )

projectController.listProjectsElastic = function() {
	var projectListService = new projectListingService();
	
    var _nself = this;
    projectListService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var userFilters = {
    	filters:_nself.req.body.filters,
    	page:_nself.req.body.page
    }
    if(_nself.req.body.filters.distress){
      projectListService.listProjects(userFilters);
    } else{
       projectListService.listProjectsElastic(userFilters);
    }
   
};

projectController.listProjects = function() {
  var projectListService = new projectListingService();
  
    var _nself = this;
    projectListService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var userFilters = {
      filters:_nself.req.body.filters,
      page:_nself.req.body.page
    }
   
    projectListService.listProjects(userFilters);
};

projectController.projectAutocomplete = function() {  
  var _selfInstance = this;
 var text = this.req.query.text;
    _app_context.esClient.search({
    index: 'irx_schema',
    type:"irx-eproduct",
    body: {
      query: {
        prefix: {
          name: text
        }
      }
    }
  }).then(function (resp) {
    var hits = resp.hits.hits;
   _selfInstance.processJson(STATUS.OK.code,STATUS.OK.msg,hits,null);
}, function (err) {
   _selfInstance.processJson(STATUS.SERVER_ERROR.code,STATUS.SERVER_ERROR.msg,err,null);
});
}

projectController.autocomplete = function() {  
  var _selfInstance = this;
  var text = this.req.query.text;
    _app_context.esClient.search({
    index: 'irx_schema',
    type:"irx-euser,irx-eproduct",
    body: {
      query: {
        prefix: {
          name: text
        }
      }
    }
  }).then(function (resp) {
    var hits = resp.hits.hits;
   _selfInstance.processJson(STATUS.OK.code,STATUS.OK.msg,hits,null);
}, function (err) {
   _selfInstance.processJson(STATUS.SERVER_ERROR.code,STATUS.SERVER_ERROR.msg,err,null);
});
}
module.exports=projectController