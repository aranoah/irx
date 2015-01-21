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
var mongoErr = require(_path_util+'/mongo-error');
var MAIL_TYPE = CONSTANTS.MAIL_TYPE;
var STATUS = CONSTANTS.him_status;
var defPage = CONSTANTS.def_page;
var hashAlgo = require(_path_util+"/sha1.js");
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var IRXVerificationModel = require(_path_model+"/IRXVerification");
var IRXProductLineModel = require(_path_model+"/IRXProductLine");
var IRXLocationModel = require(_path_model+"/IRXLocation");
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");
var IRXReviewInvitation = require(_path_model+"/IRXReviewInvitation");
var IRXReviewModel = require(_path_model+"/IRXReview");
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
	var id = this.getCustomMongoId("IUSER-")

	var hashPassword = hashAlgo.SHA1(user.password);
	var userData = new IRXUserProfileModel({
			"id":id
  			,"name": user.name
			,"password": hashPassword.toString()
			,"userId": user.emailId
			,"irxId" : id
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
			var id = _selfInstance.getCustomMongoId("IVER-")
			var verification = new IRXVerificationModel({
				"id":id,
	  			"vfData": userData.irxId
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
						"irxId": userData.irxId,
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
				User.update({"irxId":data.userId},
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
	var id = user.irxId;

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
	if(user.name != null) {
		updateObject["name"]=user.name;
	}
	if(user.id != null) {
		updateObject["id"]=user.id;
	}
	if(user.specialities != null) {
		updateObject["specialities"]=user.specialities;
	}
	
	User.update({"irxId":id},
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
	
	User.findOne({"irxId":id},
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
	if(!page){
		page=defPage
	}
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
	 				//var projectIds = new Array();
	 				// 	for (var i=0 ; i<projectList.length;i++) {

					//    projectId = mongoose.getObjectId(projectList[i]);
					//     console.log(projectId)
					//     projectIds.push(projectId)
					// }
					var start = page.start;
					var pageSize = Number(page.pageSize)+1;
		Projects.find({"id":{$in:projectList}},{},{skip:start,limit:pageSize },
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
	if(!page){
		page=defPage
	}
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
	 				// var projectIds = new Array();
	 				 if(typeof(locationList)!='undefined' && locationList!=null) {
		 				// 	for (var i=0 ; i<locationList.length;i++) {

						//     projectId = mongoose.getObjectId(locationList[i])
						//     console.log(projectId)
						//     projectIds.push(projectId)
						// }

					var start = page.start;
					var pageSize = Number(page.pageSize)+1;
					
					locations.find({"id":{$in:locationList}},{},{skip:start,limit:pageSize },
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

UserService.prototype.inviteForReview = function(data) {
	var id = this.getCustomMongoId("IIn-")
	var refCode = this.getCustomMongoId("REV-");
	var _selfInstance  = this;
	if(data.parentId == ""){
		_selfInstance.emit("done",STATUS.FORBIDDEN.code,"Please login",null,null);
		return;
	}
	
	var reviewInvitationModel = new IRXReviewInvitation({
		"id":id,
		"parentId":data.parentId,
		"targetId":data.targetId,
		"msg" : data.msg,
		"refCode" : refCode
	});
	
	reviewInvitationModel.save(function(err,reviewInvitation){
		if (err) {
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving review invitation",err,null);
		} else {
			
			var qObj = {
						"action":MAIL_TYPE.INVITATION,
						"data" :reviewInvitation
					}
					_app_context.sqs.sendMessage({
                	"QueueUrl" : _app_context.qUrl,
                	"MessageBody" : JSON.stringify(qObj)
             	 }, function(err, data){                
              });
			_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,reviewInvitation,null);
			
		}
	})
};

UserService.prototype.review = function(data) {
	var _selfInstance  = this;
	//get review invitation
	var refCode = data.refCode;
	IRXReviewInvitation.findOne({"refCode":refCode},function(err,reviewInvitation){
		if(err){
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error finding review invitation",err,null);
		} else {
			if(!reviewInvitation || reviewInvitation == null){
				_selfInstance.emit("done",STATUS.FORBIDDEN.code,STATUS.FORBIDDEN.msg,err,null);
				return;
			}
				
			if((reviewInvitation.parentId != data.parentId) || (reviewInvitation.targetId != data.agentId)) {
				
				_selfInstance.emit("done",STATUS.FORBIDDEN.code,STATUS.FORBIDDEN.msg,err,null);
				return;
			}
			// save review
			
			var id = _selfInstance.getCustomMongoId("IRev-")
			var reviewModel = new IRXReviewModel({
				"id":id,
				"parentId":data.parentId,
				"agentId":data.agentId,
				"msg" : data.msg
			});
			reviewModel.save(function(err,review){
			if (err) {
				
				_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving review invitation",err,null);
			}else {
				//clear invitation
				
				IRXReviewInvitation.remove({}, function (err) {
					if (err) {
						console.error(err)
						_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
					}else{
						console.log("Review Invitation data cleared");
						_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,null,null);
					} 
				});
				
				}
			})
		
		}
	})
	
	
	};
	
	//add last visited
	UserService.prototype.addLastVisited = function(data) {
		var _selfInstance  = this;
		var userId = data.agentId;
		var lastVisited = data.lastVisited;
		mongoose.getCollection('irxlastvisiteds').findAndModify(
 		{"agentId":userId},
 		[],
		{$push:{"lastVisited":{$each:[lastVisited],$slice:-5}}},
		{upsert:true,"new":false },
			function(err, mapping){
				if(err){
					console.error(err)
					_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
				} else{
					console.log("Added to last visited");
					_selfInstance.emit("done",STATUS.OK.code,"Added to last visited",null,null);
				}
			})
	};

	//check whether this username exist or not
	UserService.prototype.checkUserName = function(data) {
		var _selfInstance  = this;
		var text = data.text;
		var id = data.id
		IRXUserProfileModel.find({"id":text},{},{},
					function(err,users){
						if(err){
							console.error(err)
							_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);

						} else {
							if(users != null && users.length >0){
								console.log("Name is already taken");
								_selfInstance.emit("done",STATUS.ERROR.code,"Name is already taken",null,null);

							} else {
								console.log("Name can be used.");
								_selfInstance.updateUser({"id":text, "irxId":id})
								//_selfInstance.emit("done",STATUS.OK.code,"Name can be used",null,null);

							}
						}
					})
	};
module.exports = UserService;