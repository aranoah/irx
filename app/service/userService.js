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
var IRXProductLineModel = require(_path_model+"/IRXProductLine");
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");
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
									_selfInstance.emit("done",err.code,err.err,err,null);
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
UserService.prototype.getUserDetails = function(user) {
	console.log("In getUserDetails")
	var _selfInstance = this;
	var User = IRXUserProfileModel;
	var id = userId;

	User.findOne({"userId":id},
				function(err,data){
					if (err){
			 			console.error(err)
			 			_selfInstance.emit("done",err.code,err.err,err,null);
			 			
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

/*
*	List User's projects
*
**/
UserService.prototype.listUserProjects = function(user) {
	console.log("In listUserProjects")
	var _selfInstance = this;
	var User = IRXUserProfileModel;
	var id = user.userId;
	var Projects = IRXProductLineModel;
	
	// var Schema = mongoose.Schema,
 //    ObjectId = Schema.ObjectId;
 var ObjectId = require('mongodb').ObjectID
	
	var ProjectMaping = IRXAgentMProductModel;
	ProjectMaping.findOne({"agentId":"puneetsharma41@gmail.com"},
				function(err,data){
					if (err){
			 			console.error(err)
			 			_selfInstance.emit("done",err.code,err.err,err,null);
			 			
			 		} else {
			 			
			 			if(data != null){
			 				var projectList = data.project;
			 				var projectIds = new Array();
			 				for (var i=0 ; i<projectList.length;i++) {

							    projectId = new ObjectId(projectList[i]);
							    console.log(projectId)
							    projectIds.push(projectId)
							}
							
							Projects.find({ "type":"rent"},
							function(err,projectDetails){
								if(err){
									console.log(err)
									_selfInstance.emit("done",err.code,err.err,err,null);
								} else {
									console.log("yahsn",projectDetails)
									_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,projectDetails,null);			
								}	
							})
			 			} else {
			 				console.error("No Data found")
			 			_selfInstance.emit("done",404,"No project found",null,null);
			 			}
					}
				})
	
}
/*
	Register a user and send verification mail

**/
UserService.prototype.createMapping = function(user) {
	console.log("In Create Mapping")
	var objId = require('mongodb').ObjectID;

	var userData = new IRXProductLineModel({
   	"_id" : new objId(),
    "name" : "NEW HAVEN RIBBON WALK",
    "location" : {
        "name" : "Chennai",
        "city" : "Chennai",
        "state" : "Tamil nadu",
        "country" : "India",
        "locality" : "Mind It!!",
        "pincode" : "122001"
    },
    "type" : "rent",
    "description" : "Inspired by a free flowing ribbon’s soul, Tata Value Homes’ New Haven Ribbon Walk, Chennai, is home to futuristic and modern residences. Premium 1 BHK, 2BHK and 3BHK apartments with best-in-class comforts and amenities, New Haven Ribbon Walk invites you to live a life only a select few will enjoy. Indulge at the free-form clubhouse, elevated swimming pool, sauna, kids’ pool, business centre, library, garden sit outs with canopies, outdoor banquet hall, and an amphitheatre. Unwind along the winding ribbon-inspired pathways that maximises green spaces and offer an exclusive view of the lake.",
    "bhk" : {
        "lowerRange" : 1,
        "higerRange" : 3
    },
    "builtUpArea" : [ 
        {
            "lowerRange" : 100,
            "higerRange" : 500,
            "unit" : "sq feet"
        }
    ],
    "price" : "200000",
    "possession" : "Ready",
    "builderName" : "Narender Modi",
    "productType" : "Project"
});
	var _selfInstance = this;

	userData.save(function(err, userDataRes) {
		if (err) {
			_selfInstance.emit("done",err.code,"Error saving user information",err,null);
		}else{
			console.log(userDataRes)
			_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,userDataRes,null);
		}
	})
}
module.exports = UserService;