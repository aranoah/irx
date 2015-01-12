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
var agentController = new Controller();

var agentListingService = require(_path_service+"/agentListingService.js" )

agentController.listAgents = function() {
	var agentListService = new agentListingService();
	
    var _nself = this;
    agentListService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var userFilters = {
    	filters:_nself.req.params.filters,
    	page:_nself.req.params.page
    }
    
    agentListService.listAgents(_nself.req.body);
};

agentController.agentAutocomplete = function() {  
  var _selfInstance = this;
  var text = this.req.query.text;
    _app_context.esClient.search({
    index: 'irx_schema',
    type:"irx-euser",
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

module.exports=agentController