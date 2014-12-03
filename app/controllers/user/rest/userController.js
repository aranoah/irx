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
var userController = new Controller();

var userService = require(_path_service+"/userService.js" )

userController.validate_main=function(){
    /// this.req = request object, this.res = response object.
    console.log("inside validate");
    this.req.checkBody('email', 'Invalid email').notEmpty();    
    return false;
}

/*
* 	Create User and send verification url
*	@TODO : Controller level validation
**/

userController.createUser = function() {
	var userSvc = new userService();
	//Validation
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    userSvc.registerUser(_nself.req.body);
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