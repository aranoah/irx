var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var userController = new Controller();
var IRXUserProfileModel = require(_path_model+"/IRXUserProfile.js")

userController.validate_main=function(){
    /// this.req = request object, this.res = response object.
    console.log("inside validate");
    this.req.checkBody('email', 'Invalid email').notEmpty();    
    return false;
}
userController.createUser = function() {
	console.log("In Create User Method")
	var mongoose = require('mongoose');
	var hashPassword = hashAlgo.SHA1("passwd");
	var user = new IRXUserProfileModel({
  			"name": 'Puneet'
			,"password": hashPassword.toString()
			, "userId": 'IRX-PUNEET' 
			,"location":{
							"city":"Gurgaon"
							,"state":"Haryana"
							,"country":"India"
							,"name":"Puneet"
							,"pincode":"122001"
							,"lat":12
							,"lon":11
						}
			,"type" : "dealer"
			,"companyName" :"IRX_DEALER"
			,"specialities": ["New","Brokage"]
			,"permission":["edit","delete"]
			,"roles" :["1st-agent"]
	});
	var _selfInstance = this;

		user.save(function(err, user) {
		  if (err) return _selfInstance.processJson(STATUS.SERVER_ERROR.code,STATUS.SERVER_ERROR.msg,null,null);
		 return _selfInstance.processJson(STATUS.OK.code,STATUS.OK.msg,user,null)
		});
}
module.exports = userController;