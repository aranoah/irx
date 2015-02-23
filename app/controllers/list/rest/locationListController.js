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
var locationController = new Controller();

locationController.cityAutocomplete = function() {  
  var _selfInstance = this;
  var text = this.req.query.text;
    _app_context.esClient.search({
    index: 'irx_schema',
    type:"irx-elocation",
    body: {
      query: {
        match: {
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

module.exports=locationController