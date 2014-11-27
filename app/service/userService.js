/***********************************************************************
*
* DESCRIPTION :
*       Service class for user related functionalities
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		27 Nov 2014
*
* CHANGES :
*
**/
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js");
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var IRXVerificationModel = require(_path_model+"/IRXVerification");
var emailUtils = require(_path_util+"/email-utils.js");
var emailTemplates = require('email-templates');
var EventEmitter = require('events').EventEmitter;
var properties = require(_path_env+"/properties.js")
function UserService(){    

}
UserService.prototype.__proto__=EventEmitter.prototype ;
/*
	Register a user and send email code

**/
UserService.prototype.registerUser = function(user) {
	console.log("In regisetUser")
	// Make a database entry
	var mongoose = require('mongoose');
	var hashPassword = hashAlgo.SHA1(user.password);
	var userData = new IRXUserProfileModel({
  			"name": user.name
			,"password": hashPassword.toString()
			,"userId": user.emailId
			,"location":user.location
			,"type" : user.type
			,"companyName" :user.companyName
			,"specialities": user.specialities
			,"status":CONSTANTS.him_constants.USER_STATUS.PENDING_VERFICATION
	});
	var _selfInstance = this;

	userData.save(function(err, userData) {
		if (err) {
			_selfInstance.emit("done",err.code,"Error saving user information",err,null);
		}else{
			// save verification code
			var verification = new IRXVerificationModel({
	  			"vfData ": userData.emailId
				,"vfCode":"IRX-ABCD"
				,"createdOn":new Date(),
	   			"updatedOn":new Date()
			});
			verification.save(function(err, verification) {
				if(err){
					_selfInstance.emit("done",STATUS.SERVER_ERROR.code,"Error saving verification",err,null);
				}else {
					_selfInstance.emit("done",STATUS.OK.code,userData,err,null);
					// send email and verification code
					var locals = {
						"to":userData.userId,
						"subject":properties.registeration_subject,
						"name":verification.vfCode
					}
					new emailUtils().sendEmail("test",locals,function(error,success){
						if(error != null){
							console.log(error);
						}else if(success != null){
							console.log(success)
						}
					});
				}
			});
		}
		
	});
	


};
module.exports = UserService;