
/***********************************************************************
*
* DESCRIPTION :
*       Utilities to integrate and communicate sqs amazon queue
*  
* Copyright :
*   Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*   Puneet (puneet@aranoah.com)      
*
* START DATE :    
*  15 Jan 2014
*
* CHANGES :
*
**/

var CONSTANTS = require(_path_util+'/constants');
var baseService = require(_path_service+"/base/baseService.js" )
var VERIFICATION_TYPE = CONSTANTS.VERIFICATION_TYPE;
var MAIL_TYPE = CONSTANTS.MAIL_TYPE;
var emailUtils = require(_path_util+"/email-utils.js");
var smsUtils = require(_path_util+"/sms-utils.js")
var emailTemplates = require('email-templates');
var mongoose = require('mongoose');
var properties = require(_path_env+"/properties.js");
var IRXLeadModel = require(_path_model+"/IRXLead");
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var IRXVerificationModel = require(_path_model+"/IRXVerification");
var IRXProductLineModel = require(_path_model+"/IRXProductLine");

var logger = _app_context.logger;
var mongoose = require('mongoose');
function EmailPreparator(){    
	baseService.call(this);
}
EmailPreparator.prototype.__proto__=baseService.prototype ;

EmailPreparator.prototype.prepareRegisterMail = function(messageData,callback){
	var type =  VERIFICATION_TYPE.ACCOUNT;
          logger.log("debug","Send Register Mail")
          console.log("test2 !!")
           IRXVerificationModel.findOne({ 'userId': messageData.data,"type":type }, 
           	function (err, sVerification) {
            if (err){
               console.log(err)
              } else{
               var locals = {
                  "irxId": sVerification.vfData,
                  "userId":sVerification.emailId,
                  "subject":properties.registeration_subject,
                  "vfCode":sVerification.vfCode
                }
                callback(locals)
			}
        })
              
}
module.exports = EmailPreparator;
