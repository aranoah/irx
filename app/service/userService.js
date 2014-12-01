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
var properties = require(_path_env+"/properties.js");
var mongoose = require('mongoose');
function UserService(){    

}
UserService.prototype.__proto__=EventEmitter.prototype ;

/*
	Register a user and send verification mail

**/
UserService.prototype.registerUser = function(user) {
	console.log("In registerUser")
	// Make a database entry
	
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
	  			"vfData": user.emailId
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
						"userId":userData.userId,
						"subject":properties.registeration_subject,
						"vfCode":verification.vfCode
					}
					new emailUtils().sendEmail("test",locals,function(error,success){
						if(error != null){
							console.error(error);
						}else if(success != null){
							console.log(success)
						}
					});
				}
			});
		}
		
	});
};
/*
	Register a user and send email code

**/
UserService.prototype.verifyUser = function(data) {
	console.log("In verifyUser")
	// Make a database entry
	var mongoose = require('mongoose');
	var verificationModel = IRXVerificationModel
	var User = IRXUserProfileModel
	var _selfInstance = this;
	verificationModel.findOne({ 'vfData': data.userId, "vfCode":data.vfCode }, function (err, verification) {
 		if (err){
 			console.error(err)
 			_selfInstance.emit("done",err.code,err.err,err,null);
 			
 		} else{

 			if(verification && verification != null){
 				console.log('Verification code verified');
 				console.log("Updating user",data.userId);
				User.update({"userId":data.userId},
							{$set:{"status":CONSTANTS.him_constants.USER_STATUS.VERIFIED}},
							function(err, numberAffected, raw){
								console.log(numberAffected)
								if(err){
									console.error(err)
									_selfInstance.emit("done",err.code,err.err,err,null);
								}else{
									if(numberAffected >0){
										console.log("User updated successfully");
										
						 				verificationModel.remove({}, function (err) {
											if (err) {
												console.error(err)
												_selfInstance.emit("done",err.code,err.err,err,null);
											}else{
												console.log("Verfication data cleared");
												_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,err,null);
											} 
										});
										
									}else{
										console.log("User not updated")
										_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.code,err,null);
									}
								}	
							})
 				
 			} else{
 				console.log("Verification data not matched")
				_selfInstance.emit("done",500,"Verification data not matched","Verification data not matched",null);
 			}
 			
  		}
  		
	})
};
module.exports = UserService;