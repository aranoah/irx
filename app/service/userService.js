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
var s3Utils = require(_path_util+'/s3-utils')
var mongoErr = require(_path_util+'/mongo-error');
var MAIL_TYPE = CONSTANTS.MAIL_TYPE;
var VERIFICATION_TYPE = CONSTANTS.VERIFICATION_TYPE;
var STATUS = CONSTANTS.him_status;
var defPage = CONSTANTS.def_page;
var hashAlgo = require(_path_util+"/sha1.js");
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var IRXProfileClaim = require(_path_model+"/IRXProfileClaim");
var IRXVerificationModel = require(_path_model+"/IRXVerification");
var IRXProductLineModel = require(_path_model+"/IRXProductLine");
var IRXLocationModel = require(_path_model+"/IRXLocation");
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");
var IRXReviewInvitationModel = require(_path_model+"/IRXReviewInvitation");
var IRXReviewModel = require(_path_model+"/IRXReview");
var IRXLastVisitedModel = require(_path_model+"/IRXLastVisited");
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
			,"status": CONSTANTS.him_constants.USER_STATUS.PENDING_VERFICATION
	});
	var _selfInstance = this;

	userData.save(function(err, userData) {
		if (err) {
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
		} else{
			// save verification code
			var id = _selfInstance.getCustomMongoId("IVER-");
			var type =  VERIFICATION_TYPE.ACCOUNT;
			var vData = {
				"data":userData.irxId,
				"irxId" : userData.irxId,
				"emailId" : userData.userId,
				"phoneNum" : userData.phoneNum
			}
			 _selfInstance.saveVerificationCode(vData,type,function(code,msg){
			 	
			 	if(code == STATUS.OK.code){
					_selfInstance.emit("done",code,msg,userData,null);
				} else{
					_selfInstance.emit("done",code,msg,null,null);
				}
			 }
			)
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
	var verificationModel = IRXVerificationModel;
	var User = IRXUserProfileModel;
	var _selfInstance = this;
	var updateObj = {$set:{"status":CONSTANTS.him_constants.USER_STATUS.VERIFIED}};

	verificationModel.findOne({ 'vfData': data.userId, "vfCode":data.vfCode }, function (err, verification) {
 		if (err){
 			console.error(err)
 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,null);
 			
 		} else{

 			if(verification && verification != null){
 				console.log('Verification code verified');
 				console.log("Updating user",data.userId);
 				if(data.phoneNum && data.phoneNum == true){
					updateObj={$set:{"phoneNum":verification.phoneNum}};
				}
				User.update({"irxId":data.userId},
							updateObj,
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
	if(user.file && user.file != null) {
		var file = user.file;
		var s3UtilsObj = new s3Utils();
		var type = file.type;
		var ext ="";
		if(type && type !=""  ){
			var iType = type.split("/");
			if(iType != null && iType.length >0){
				ext = iType[1]
			}
		}
		var remotefileName = "user/"+id+"-img."+ext;
		s3UtilsObj.uploadFile(file.path,file.name,remotefileName)
		updateObject["imageUrl"]=properties.user_image_url+remotefileName;
		
	}
	if(user.phoneNum != null) {
		updateObject["phoneNum"]=user.phoneNum;
		var id = _selfInstance.getCustomMongoId("IVER-");
			var type =  VERIFICATION_TYPE.PHONE;
			var vData = {
				"data" : user.phoneNum,
				"irxId" : user.irxId,
				"phoneNum" : user.phoneNum
			}
			 _selfInstance.saveVerificationCode(vData,type,function(code,msg){
			 	
			 	if(code == STATUS.OK.code){
					_selfInstance.emit("done",code,msg,"",null);
				} else{
					_selfInstance.emit("done",code,msg,null,null);
				}
			 }
			)
			 return;
	}
	console.log("yoyooyoo!!",updateObject);
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
UserService.prototype.getUserDetails = function(uData) {
	console.log("In getUserDetails")
	var _selfInstance = this;
	var User = IRXUserProfileModel;
	var id = uData.userId;
	
	User.findOne({$or: [ { "irxId": id }, { "id": id } ] },{"password":0,"userId":0},
				function(err,data){
					if (err){
			 			console.error(err)
			 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			 			
			 		} else{
			 			
			 			if(data && data != null){
			 				var invitationData = {
			 					"agentId":uData.targetId,
			 					"parentId":data.irxId
			 				}

			 				var isInvited = false;
			 				if(data.targetId != ""){
			 					
			 					isInvited = _selfInstance.hasInvitationForReview(invitationData,function(isInvited){
			 						
			 						data["isInvited"]= isInvited;
			 							
			 						_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,data,null);
			 					});
			 				}else{
			 						_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,data,null);
			 				}
			 			
			 				
			 			} else{
			 				console.log("User data not found")
							_selfInstance.emit("done",404,"User data not found","User data not found",null);
			 			}
			 			
			  		}
				})
	
}
/*
*	Get User Details
*
**/
UserService.prototype.getUserDetailsAdmin = function(uData) {
	console.log("In getUserDetails")
	var _selfInstance = this;
	var User = IRXUserProfileModel;
	var id = uData.userId;
	console.log("qwewret",id)
	User.findOne( { "irxId": id} ,{"password":0},
				function(err,data){
					if (err){
			 			console.error(err)
			 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			 			
			 		} else{
			 			
			 			if(data && data != null){
			 					console.log(data)
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
					var distress= data.distress;
					var pageSize = Number(page.pageSize)+1;
		Projects.find({"id":{$in:projectList}},{},{skip:start,limit:pageSize },
					function(err,projectDetails){
						if(err){
							console.log(err)
							_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
						} else {
							
								_selfInstance.processPagenation(projectDetails,page)
								var result ={
								"projects":projectDetails,
								"distress":distress
							}
							_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,result,page);			
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
	
	var reviewInvitationModel = new IRXReviewInvitationModel({
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
	console.log("achaaa",{"parentId":data.parentId,"targetId":data.agentId})
	IRXReviewInvitationModel.findOne({"parentId":data.parentId,"targetId":data.agentId},function(err,reviewInvitation){
		if(err){
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error finding review invitation",err,null);
		} else {
			if(!reviewInvitation || reviewInvitation == null){
				_selfInstance.emit("done",STATUS.FORBIDDEN.code,STATUS.FORBIDDEN.msg,err,null);
				return;
			}
			var reviewId = reviewInvitation.id;
			// save review
			
			var id = _selfInstance.getCustomMongoId("IRev-")
			var reviewModel = new IRXReviewModel({
				"id":id,
				"parentId":data.parentId,
				"agentId":data.agentId,
				"msg" : data.msg,
				"rating" : data.rating,
				"postedOn" : new Date(),
				"agentName" : data.agentName,
				"agentImage" : data.agentImage
			});
			reviewModel.save(function(err,review){
			if (err) {
				
				_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving review invitation",err,null);
			}else {
				//clear invitation
				
				IRXReviewInvitationModel.remove({"id":reviewId}, function (err) {
					if (err) {
						console.error(err)
						_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
					}else{
						console.log("Review Invitation data cleared");
						_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,review,null);
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

	//check whether this username exist or not
	UserService.prototype.saveVerificationCode = function(vData,type,callback) {
		var _selfInstance  = this;
			var id = _selfInstance.getCustomMongoId("IVER-")
			var verCode = _selfInstance.getCustomMongoId("IVC-")
		// send email
		_selfInstance.once('sendEmail',function(sVerification){
			var action="";
			var data={};
			if(type==VERIFICATION_TYPE.REGISTER){
				action = MAIL_TYPE.REGISTER;
				data = sVerification.userId;
			} else if(type==VERIFICATION_TYPE.PHONE){
				action=MAIL_TYPE.VERIFICATION
				data = sVerification.phoneNum;
			}else if(type==VERIFICATION_TYPE.PASSWORD){

				action=MAIL_TYPE.FORGET_PASSWORD
				data = sVerification.userId;
			}
			var qObj = {
				"action":action,
				"data" : data
			}
			var strQObj = JSON.stringify(qObj)
			console.log("qObject",qObj)
			_app_context.sqs.sendMessage({
	        	"QueueUrl" : _app_context.qUrl,
	        	"MessageBody" : strQObj
	     	 }, function(err, data){ 
	     	      if(err){
	     	      	console.log("Error putting in queue")
	     	      	callback(STATUS.ERROR.code,"Error putting in queue");
					return;
	     	      } else{
	     	      	console.log("Mail has been ")
	     	      	callback(STATUS.MAIL_SUCCESS.code,STATUS.MAIL_SUCCESS.msg);
					return;
	     	      }         
	      });

			
		})
		// save verification data
		_selfInstance.once('saveVerification',function(){
			
			var verification = new IRXVerificationModel({
					"id":id
		  			,"vfData": vData.data
		  			,"type" : type
		  			,"userId" : vData.emailId
					,"vfCode": verCode
					,"createdOn":new Date()
		   			,"updatedOn":new Date()
		   			,"emailId" : vData.emailId
		   			,"phoneNum" : vData.phoneNum
				});
				verification.save(function(err, sVerification) {
					if(err){
						console.error("Error saving verification data :- ",mongoErr.resolveError(err.code).code +","+mongoErr.resolveError(err.code).msg)
					     callback(mongoErr.resolveError(err.code).code,"Error updating verification data");
							return;								
						} else {
						console.log("Verification saved")
						_selfInstance.emit("sendEmail",sVerification);
					}
					return;
				});
		})

	
		mongoose.getCollection('irxverifications').findAndModify(
			{"userId":vData.irxId,"type":type},
			[],
			{$set:{"vfData":vData.data}},
			{"new":true },
			function(err,mVerification){
				if(err){
					console.error("Error updating verification data :- ",mongoErr.resolveError(err.code).code +","+mongoErr.resolveError(err.code).msg)
					callback(mongoErr.resolveError(err.code).code,"Error updating verification data");
					return;
				} else {
					if(mVerification != null && mVerification.vfData==vData.data){
						console.log("Verification data has been updated");
						_selfInstance.emit("sendEmail",mVerification)
						return;
					}else{
						_selfInstance.emit("saveVerification")
						return;
					}
							
				}
			}
			)
			
	};
	
	UserService.prototype.listLastVisited = function(data){
		var irxId = data.irxId;
		var _selfInstance = this;

		IRXLastVisitedModel.findOne({"agentId":irxId},
					function(err,lastVisitedData){
						if(err){
								console.error(err)
								_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
							} else{
								if(lastVisitedData){
									
									_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,lastVisitedData.lastVisited,null);			
								} else {
									_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,new Array(),null);
								}
								
							}		
					})
	}

    
    
/*
	Register a user and send verification mail

**/
UserService.prototype.fbRegisterUser = function(user) {
	console.log("In registerFBUser")
	// Make a database entry
    var _selfInstance = this;
	var id = ("IUSER-F-"+user.id);
    _selfInstance.once("registerNewUser",function(){
        var hashPassword = hashAlgo.SHA1((id+"12345678").substring(0,10));
	    var userData = new IRXUserProfileModel({
			"id":id
  			,"name": user.name
			,"password": hashPassword.toString()
			,"userId": user.id+"@facebook.com"
			,"irxId" : id
			,"location":null
			,"type" : "user"
			,"companyName" :null
			,"specialities":null
			,"status": CONSTANTS.him_constants.USER_STATUS.VERIFIED
            ,"contactEmailId": null
	    });
        userData.save(function(err,res){
         if(err){
             _selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
         }else if(res==null){
           _selfInstance.emit("done",0,"unable to create user, try later.",null,null,null);
         }else{
            _selfInstance.emit("done",0,"OK",userData,null); 
          }
        });
    });
   IRXUserProfileModel.findOne({id:id},{userId:1,name:1,imageUrl:1},function(err,res){
       if(err){
             _selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
       }else if(res==null){
           _selfInstance.emit("registerNewUser");
       }else{
            _selfInstance.emit("done",0,"OK",res,null); 
       }
   });
	
};
UserService.prototype.forgetPassword = function(userId){ 
		var _selfInstance = this;
		IRXUserProfileModel.findOne({"userId":userId},{id:1},function(err,res){
       if(err){
             _selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
       }else if(res==null){
         _selfInstance.emit("done",404,"User data not found","User data not found",null);
       }else{
       		var id = _selfInstance.getCustomMongoId("IVER-");
			var type =  VERIFICATION_TYPE.PASSWORD;
			var vData = {
				"data":userId,
				"emailId" : userId,
			}

			_selfInstance.saveVerificationCode(vData,type,function(code,msg){
			 	
			 	if(code == STATUS.OK.code){
					_selfInstance.emit("done",code,msg,null,null);
				} else{
					_selfInstance.emit("done",code,msg,null,null);
				}
			 }
			)
       }
   });
			
	}


	UserService.prototype.changePassword = function(data){ 
		console.log("qwertyuyuiu")
		var _selfInstance = this;
		var userId = data.userId;
		var code = data.code;
		var password = data.password;
		var hashPassword = hashAlgo.SHA1(password);

		IRXVerificationModel.findOne({"vfData":userId,"vfCode":code},{id:1},function(err,res){
       if(err){
             _selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
       }else if(res==null){
         _selfInstance.emit("done",404,"Token expired","Token expired",null);
       }else{
       		IRXUserProfileModel.update({"userId":data.userId},
							{"password":hashPassword.toString()},
							function(err, numberAffected, raw){
								
								if(err){
									console.error(err)
									_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
								}else{
									if(numberAffected >0){
										console.log("User updated successfully");
										
						 				IRXVerificationModel.remove({"id":res.id}, function (err) {
											if (err) {
												console.error(err)
												_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
											}else{
												console.log("Verfication data cleared");
												_selfInstance.emit("done",STATUS.OK.code,"Password updated successfully",err,null);
											} 
										});
										
									}else{
										console.log("User not updated")
										_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.code,err,null);
									}
								}	
							})
       }
   });
			
	}

	
UserService.prototype.hasInvitationForReview = function(data, pupulateData){
	var _selfInstance = this;
	console.log({"parentId":data.parentId,"targetId":data.agentId})
	IRXReviewInvitationModel.findOne({"parentId":data.parentId,"targetId":data.agentId},{"id":1},function(err,data){
		if(err){
             _selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
       }else if(data==null){
       		console.log("4")
       		pupulateData(false)
       		return ;
            //_selfInstance.emit("done",0,"OK",false,null); 
       }else{
       		console.log("5")
       		pupulateData(true)
       		return ;
            //_selfInstance.emit("done",0,"OK",true,null); 
       }
	})
}


UserService.prototype.listReviews = function(data){
	var _selfInstance = this;
	var page = data.page;
	if(!page) {
		page=defPage;	
	}
	var userId = data.userId;
	IRXReviewModel.find({"parentId":userId},{},{skip:page.start,limit:page.pageSize+1 },
					function(err,reviews){
		if(err){
             _selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
       }else {
       		if(reviews && reviews != null && reviews.length>0){

       			_selfInstance.processPagenation(reviews,page);
       			_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,reviews,page);
       		}else{
       			console.error("No Reviews found")
	 			_selfInstance.emit("done",404,"No Reviews found",null,null);
       		}
       		
       }
	})
}


UserService.prototype.sendUserDetails = function(data){
	var _selfInstance = this;
	
	var targetEmailId = data.emailId
	var userId = data.userId;
	var qObj = {
				"action":MAIL_TYPE.USER_DETAILS,
				"irxId" : userId,
				"targetEmailId":targetEmailId
			}
			var strQObj = JSON.stringify(qObj)
			
			_app_context.sqs.sendMessage({
	        	"QueueUrl" : _app_context.qUrl,
	        	"MessageBody" : strQObj
	     	 }, function(err, data){ 
	     	      if(err){
	     	      	console.log("Error putting in queue")
	     	      	_selfInstance.emit("done",STATUS.OK.code,"Error putting in queue",null,null);
					return;
	     	      } else{
	     	      	console.log("Successfully queued",data)
	     	      	_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,null,null);
					return;
	     	      }   
	})
}

UserService.prototype.claimProfile = function(data){
	var _selfInstance = this;
	var id = _selfInstance.getCustomMongoId("ICP-");
	var claimData = new IRXProfileClaim({
		"id":id,
		"claimerId":data.irxId,
		"profileId":data.profileId,
		"date":new Date()
	})
	claimData.save(function(err,sClaimData){
		if (err) {
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
		} else{
			var qObj = {
				"action":MAIL_TYPE.CLAIM_PROFILE,
				"claimerId" : sClaimData.claimerId,
				"claimerName": data.name,
				"profileId": data.profileId

				}
			var strQObj = JSON.stringify(qObj)
			
			_app_context.sqs.sendMessage({
	        	"QueueUrl" : _app_context.qUrl,
	        	"MessageBody" : strQObj
	     	 }, function(err, data){ 
	     	      if(err){
	     	      	console.log("Error putting in queue")
	     	      	_selfInstance.emit("done",STATUS.OK.code,"Error putting in queue",err,null);
					return;
	     	      } else{
	     	      	console.log("Successfully queued",data)
	     	      	_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,null,null);
					return;
	     	      }   
	})
		}
	})
}
module.exports = UserService;
