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
var mongoErr = require(_path_util+'/mongo-error')
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js");
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var IRXVerificationModel = require(_path_model+"/IRXVerification");
var IRXProductLineModel = require(_path_model+"/IRXProductLine");
var IRXLocationModel = require(_path_model+"/IRXLocation");
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");

var emailUtils = require(_path_util+"/email-utils.js");
var emailTemplates = require('email-templates');
var mongoose = require('mongoose');

var properties = require(_path_env+"/properties.js");
var baseService = require(_path_service+"/base/baseService");

var mongoose = require('mongoose');
function UserService(){    
	baseService.call(this);
}
UserService.prototype.__proto__=baseService.prototype ;

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
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
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
	Verify user verification code

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
 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,null);
 			
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
									_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
								}else{
									if(numberAffected >0){
										console.log("User updated successfully");
										
						 				verificationModel.remove({}, function (err) {
											if (err) {
												console.error(err)
												_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
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

/*
*	Update User
**/
UserService.prototype.updateUser = function(user) {
	console.log("In updateUser")
	var _selfInstance = this;
	var User = IRXUserProfileModel;
	var id = user.id;

	/*
	*	Update user
	*/

	var updateObject = {};
	
	if(user.location != null) {
		updateObject["location"]=user.location;
	}
	if(user.type != null) {
		updateObject["type"]=user.type;
	}
	if(user.companyName != null) {
		updateObject["companyName"]=user.companyName;
	}
	if(user.specialities != null) {
		updateObject["specialities"]=user.specialities;
	}
	
	User.update({"userId":id},
							{
								$set:updateObject
							},
							function(err, numberAffected, raw){
								console.log(numberAffected)
								if(err){
									console.error(err)
									_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
								} else{
									if(numberAffected >0){
										console.log("User updated successfully");
										_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,err,null);
						 				
									}else{
										console.log("User not updated")
										_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.code,err,null);
									}
								}	
							})
	
}

/*
*	Get User Details
*
**/
UserService.prototype.getUserDetails = function(userId) {
	console.log("In getUserDetails")
	var _selfInstance = this;
	var User = IRXUserProfileModel;
	var id = userId;
	
	User.findOne({"userId":id},
				function(err,data){
					if (err){
			 			console.error(err)
			 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			 			
			 		} else{

			 			if(data && data != null){

			 				_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,data,null);
			 				
			 			} else{
			 				console.log("User data not found")
							_selfInstance.emit("done",404,"User data not found","User data not found",null);
			 			}
			 			
			  		}
				})
	
}

/************************
	List User's projects
*************************/

UserService.prototype.listUserProjects = function(user) {
	console.log("In listUserProjects")
	var _selfInstance = this;
	var User = IRXUserProfileModel;
	var id = user.userId;
	var page = user.page;
	
	var Projects = IRXProductLineModel;
	
 	var ObjectId = require('mongodb').ObjectID
	
	var ProjectMaping = IRXAgentMProductModel;
	ProjectMaping.findOne({"agentId":id},
		function(err,data){
			if (err){
	 			console.error(err)
	 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
	 			
	 		} else {
	 			
	 			if(data != null){
	 				var projectList = data.project;
	 				var projectIds = new Array();
	 				for (var i=0 ; i<projectList.length;i++) {

					    projectId = new ObjectId(projectList[i]);
					    console.log(projectId)
					    projectIds.push(projectId)
					}
					var start = page.start;
					var pageSize = Number(page.pageSize)+1;
		Projects.find({"_id":{$in:projectIds}},{},{skip:start,limit:pageSize },
					function(err,projectDetails){
						if(err){
							console.log(err)
							_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
						} else {
								_selfInstance.processPagenation(projectDetails,page)
							_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,projectDetails,page);			
						}	
					})
	 			} else {
	 				console.error("No Data found")
	 			_selfInstance.emit("done",404,"No project found",null,null);
	 			}
			}
		})
	
}

/************************
	List Users locations
*************************/

UserService.prototype.listUserLocations = function(user) {
	console.log("In listUserLocations")
	var _selfInstance = this;

	var User = IRXUserProfileModel;
	var id = user.userId;
	var page = user.page;
	
	var locations = IRXLocationModel;
	
 	var ObjectId = require('mongodb').ObjectID
	
	var LocationMaping = IRXAgentMProductModel;
	LocationMaping.findOne({"agentId":id},
		function(err,data){
			if (err){
	 			console.error(err)
	 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
	 			
	 		} else {
	 			
	 			if(data != null){
	 				var locationList = data.location;
	 				var projectIds = new Array();
	 				if(typeof(locationList)!='undefined' && locationList!=null) {
		 				for (var i=0 ; i<locationList.length;i++) {

						    projectId = mongoose.getObjectId(locationList[i])
						    console.log(projectId)
						    projectIds.push(projectId)
						}

					var start = page.start;
					var pageSize = Number(page.pageSize)+1;
					console.log("yahan !!", start)
					locations.find({"_id":{$in:locationList}},{},{skip:start,limit:pageSize },
					function(err,locationDetails){
						if(err){
							console.log(err)
							_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
						} else {
								_selfInstance.processPagenation(locationDetails,page)
							_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,locationDetails,page);			
						}	
					})
	 			} else {
	 				console.error("No Data found")
	 			_selfInstance.emit("done",404,"No project found",null,null);
	 			}
	 			}
			}
		})
	
}
UserService.prototype.createLocation = function(first_argument) {
	console.log("HEy !!")
	var userData = new IRXLocationModel({
  			

    "_id" : "gurgaon",
    "location" : {
        "city" : "gurgaon",
        "country" : "India",
        "locality" : "ashok vihar phase ii",
        "pincode" : 122001,
        "state" : "haryana",
        "taluka" : ""
    },
    "name" : "gurgaon"
}
	);
	var _selfInstance = this;

	userData.save(function(err, userData) {
		if (err) {
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
		}else {
			_selfInstance.emit("done",0,"Done",err,null);
		}
	}
	)
};
module.exports = UserService;