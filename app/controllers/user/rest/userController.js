/***********************************************************************
*
* DESCRIPTION :
*       Test controller for user related services
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		11 Nov 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var commonValidator = require(_path_util+"/commonValidator")
var userController = new Controller();

var userService = require(_path_service+"/userService.js" )

/*
* Validate function for user registration
*/
userController.validate_createUser=function(){
      var myvalidator = new commonValidator(this.req);
    /// this.req = request object, this.res = response object.
    console.log("inside validate",this.req.body.emailId);
    myvalidator.validate("emailId","isEmail",this.req.body.emailId);
    //validator.isEmail(this.req.body.emailId);
    console.log(myvalidator.getErrors())
}

/*
* Validate function for user registration
*/
userController.validate_updateUser=function(){
      var myvalidator = new commonValidator(this.req);
    /// this.req = request object, this.res = response object.
    console.log("inside validate",this.req.body.emailId);
    myvalidator.validate("emailId","isEmail",this.req.body.emailId);
    //validator.isEmail(this.req.body.emailId);
    console.log(myvalidator.getErrors())
}


/*
* 	Create User and send verification url
*	
**/

userController.createUser = function() {
	var userSvc = new userService();
	//Validation
    if(this.req.errors.hasError()){
       this.processJson(403,"validation error",this.req.errors.getErrors());
       return;
    }
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    userSvc.registerUser(_nself.req.body);
}

/*
*   Create User and send verification url
* 
**/

userController.updateUser = function() {
  var userSvc = new userService();
  //Validation
    if(this.req.errors.hasError()){
       this.processJson(403,"validation error",this.req.errors.getErrors());
       return;
    }
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var user = _nself.req.body;
    user.id = _nself.req.params.userId;
    userSvc.updateUser(user);
}

/*
* 	Verify User 
*	@TODO : Controller level validation
**/

userController.verifyUser = function() {
	var userSvc = new userService();
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var userId = _nself.param("userId");
    var vfCode = _nself.param("vfCode");
    var data = {
    	"userId":userId,
    	"vfCode":vfCode
    }
    console.log(data)
    userSvc.verifyUser(data);
}
/*
*   Login user 
*   @TODO : Controller level validation
**/

userController.login = function() {
  console.log("In Login Method")
  var _nself =this;
   _app_context.cansec.validate(_nself.req,_nself.res,function(){
      _nself.processJson(200,"OK",_nself.req.session.user,null)
    });
  
}
/*
*   Logout user 
*   @TODO : Controller level validation
**/

userController.logout = function() {
  console.log("In Login Method")
  
   _app_context.cansec.clear(this.req,this.res);
    this.processJson(200,"OK",null,null)
   
}
module.exports = userController;