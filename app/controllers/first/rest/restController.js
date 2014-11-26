/***********************************************************************
*
* DESCRIPTION :
*       Test controller 
*  
* Copyright :
*   Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*   Puneet (puneet@aranoah.com)      
*
* START DATE :    
*   11 Nov 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var smsUtils = require(_path_util+"/sms-utils.js");
var s3Utils = require(_path_util+"/s3-utils.js");
var restController = new Controller();
var events = require('events');


restController.validate_main=function(){
    /// this.req = request object, this.res = response object.
    console.log("inside validate");
    this.req.checkBody('email', 'Invalid email').notEmpty();    
    return false;
}


restController.main = function() {
	/*** if validation applied for this method then call use handle validation**/
  console.log(1)
	var errors = this.req.validationErrors();
	if (errors) {
		console.log(errors);
		this.processJson(STATUS.CLIENT_ERROR.code,STATUS.CLIENT_ERROR.msg,errors,null);
    	return;
  	}

  	this.title = 'Locomotive';
  	this.err="";
  	this.processJson(STATUS.OK.code,STATUS.OK.msg,"result",null);
}

restController.elasticTest = function() {
  var _selfInstance = this;
    _app_context.esClient.search({
    index: 'irx_schema',
    type:"irx-euser",
    body: {
      query: {
        match: {
          name: 'Puneet'
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

restController.sendSms = function() {
 
  new smsUtils().sendSms(this.req.body.message);
}

restController.s3Test = function() {
  var _nself = this;
  var s3Utils1 = new s3Utils();
  s3Utils1.listObjects();
  s3Utils1.on(function(code,msg,err,errValue){
    _nself.processJson(code,msg,err,errValue);
  });
}

module.exports = restController;
