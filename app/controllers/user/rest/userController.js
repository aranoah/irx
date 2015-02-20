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

var logger = _app_context.logger;
var userService = require(_path_service+"/userService.js" )
var userController = new Controller();
/*
* Validate function for user registration
*/
userController.validate_createUser=function(){
      var myvalidator = new commonValidator(this.req);
    /// this.req = request object, this.res = response object.
    console.log("inside validate",this.req.body.emailId);
    
    var validateEmail = ["required","isEmail"];
    myvalidator.validate("emailId",validateEmail,this.req.body.emailId);

    var validateName = ["required"];
    myvalidator.validate("name",validateName,this.req.body.name);
    
    var validatePassword = ["required"];
    myvalidator.validate("password",validatePassword,this.req.body.password);

    console.log(myvalidator.getErrors())
}
/*
* Validate function for change password
*/
userController.validate_changePassword=function(){
    var myvalidator = new commonValidator(this.req);
    /// this.req = request object, this.res = response object.
    console.log("inside validate change password",this.req.query.userId);
    
    var validateEmail = ["required","isEmail"];
    myvalidator.validate("userId",validateEmail,this.req.query.userId);

    var validateCode = ["required"];
    myvalidator.validate("code",validateCode,this.req.query.code);

    var validatePassword = ["required"];
    myvalidator.validate("password",validatePassword,this.req.query.password);

    console.log(myvalidator.getErrors())
}
/*
* Validate function for user sendUserDetails
*/
userController.validate_sendUserDetails=function(){
      var myvalidator = new commonValidator(this.req);
    
    var validateEmail = ["required","isEmail"];
    myvalidator.validate("emailId",validateEmail,this.req.query.emailId);

    var validateName = ["required"];
    myvalidator.validate("name",validateName,this.req.query.name);

    var validatePhone = ["isNumeric"];
    myvalidator.validate("phoneNum",validatePhone,this.req.query.phoneNum);

    console.log(myvalidator.getErrors())
}
/*
* Validate function for valid email while sending invitation
*/
userController.validate_inviteForReview=function(){
      var myvalidator = new commonValidator(this.req);
    
    var validateEmail = ["required","isEmail"];
    myvalidator.validate("emailId",validateEmail,this.req.params.userid);

    console.log(myvalidator.getErrors())
}
/*
* Validate function for user update
*/
userController.validate_updateUser=function(){
      var myvalidator = new commonValidator(this.req);
    /// this.req = request object, this.res = response object.
    console.log("inside validate",this.req.body.emailId);
    
    var validatePhone = ["isNumeric"];
    myvalidator.validate("phoneNum",validatePhone,this.req.body.phoneNum);
    
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
       this.processJson(400,"validation error",this.req.errors.getErrors());
       return;
    }
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    userSvc.registerUser(_nself.req.body);
}

/*
*   Update User
* 
**/

userController.updateUser = function() {
  var userSvc = new userService();
  if(this.req.errors.hasError()){
       this.processJson(400,"validation error",this.req.errors.getErrors());
       return;
    }
    var _nself = this;
    userSvc.on("done", function(status,msg,result,page){
     _nself.processJson(status,msg,result,page);
    });
      var user = _nself.getCurrentUserInfo(_nself);
      var userData={};

      if(_nself.req.body){
        userData = _nself.req.body;
      }
       userData.irxId=user.irxId
     
    if(_nself.req.files){
       userData.file=_nself.req.files.image;
    }
   

    userSvc.updateUser(userData);
}

/*
*   Get User Details
* 
**/

userController.getUserDetails = function() {
  var userSvc = new userService();
 
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    
    userId= _nself.req.params.userId;
    userSvc.getUserDetails(userId);
}
/*
*  forget Password
*
**/
userController.forgetPassword = function() {
  var userSvc = new userService();
 
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    
    userId= _nself.req.params.userId;
    userSvc.forgetPassword(userId);
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
    var userId = _nself.req.param("userId");
    var vfCode = _nself.req.param("vfCode");
    var vfData = _nself.req.param("userId");
    var phoneNum = false;
    if(_nself.req.query.phoneNum && _nself.req.query.phoneNum !=" "){
      phoneNum = true;
      vfData = _nself.req.param("vfData");
    }
    var data = {
    	"userId":userId,
    	"vfCode":vfCode,
      "phoneNum":phoneNum,
      "vfData":vfData
    }
    userSvc.verifyUser(data);
}
/*
*   Verify Phone 
* @TODO : Controller level validation
**/

userController.verifyPhone = function() {
  var userSvc = new userService();
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var user = _nself.getCurrentUserInfo(_nself);
    var vfCode = _nself.req.param("vfCode");
    var vfData = _nself.req.param("userId");
    var phoneNum = false;
    if(_nself.req.query.phoneNum && _nself.req.query.phoneNum !=" "){
      phoneNum = true;
      vfData = _nself.req.param("vfData");
    }
    var data = {
      "userId":user.irxId,
      "vfCode":vfCode,
      "phoneNum":phoneNum,
      "vfData":vfData
    }
    userSvc.verifyUser(data);
}
/*
*   Login user 
*   @TODO : Controller level valid ation
**/

userController.login = function() {
  var _nself =this;
  var userSvc = new userService();
  _app_context.cansec.validate(_nself.req,_nself.res,function(){
      if(_nself.req.session){
          var user = _nself.req.session['X-CS-Auth'].user;
          if(user.isnew && _nself.req.param("action") == "register" ){
              userSvc.on("done", function(){
                   _nself.processJson(0,"OK",_nself.req.session['X-CS-Auth'].user,null);
              });
              userSvc.updateUserType(user.userId, _nself.req.param("userType"));
           }else{
               _nself.processJson(0,"OK",_nself.req.session['X-CS-Auth'].user,null);   
           }
      }else{
         _nself.processJson(0,"Error","Error",null)
      }    
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

/*
*   List User Projects

*   @TODO : Controller level validation
**/

userController.listUserProjects = function() {
    try{
  var _nself = this;
  var userId= _nself.req.params.userId;
  var page = _nself.request.query.page;
  
  var userSvc = new userService();
   var data= {
      "page":page,
      "userId":userId
    }
    userSvc.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
  userSvc.listUserProjects(data);
 
   }catch(e){
    
   }
}

/*
*   List User Locations
*
*   @TODO : Controller level validation
**/

userController.listUserLocations = function() {
  var _nself = this;
  userId= _nself.req.params.userId;
  var page = _nself.request.query.page;
  
  if(!page){
    page={
      "start":0,
      "pageSIze":3
    }
  }
  
  var userSvc = new userService();
 
   var data= {
      "page":page,
      "userId":userId
    }
    userSvc.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    
    userSvc.listUserLocations(data);
  
}

/*
* Invite anyone to review your profile. Sends email and sms
*/
userController.inviteForReview = function(){
  var _nself = this;
  var targetId = _nself.req.params.userid;
  var parentId = _nself.getCurrentUser(_nself);
  var msg = _nself.req.query.msg;
  var userSvc = new userService();
  if(this.req.errors.hasError()){
       this.processJson(400,"validation error",this.req.errors.getErrors());
       return;
    }
  userSvc.on("done", function(code,msg,result,errValue){
    _nself.processJson(code,msg,result,errValue);
  });
  var data = {
    "parentId":parentId,
    "targetId": targetId,
    "msg":msg
  }
  userSvc.inviteForReview(data);
}

/*
* Review a profile
*/
userController.review = function(){
  var _nself = this;
  var parentId = _nself.req.params.parentId;
 
  var msg = _nself.req.body.msg;
  var rating = _nself.req.body.rating;
  var user = _nself.getCurrentUserInfo(_nself);
 
  var userSvc = new userService();
  userSvc.on("done", function(code,msg,result,errValue){
    _nself.processJson(code,msg,result,errValue);
  });
  var data = {
    "parentId":parentId,
    "agentId": user.userId,
    "msg":msg,
    "rating":rating,
    "agentName": user.name,
    "agentImage" : user.imageUrl
  }
  userSvc.review(data);
}

/*
* Add last visited pages to a user
*/
userController.addLastVisited = function(){
  var _nself = this;
  var name = _nself.req.body.name;
  var url = _nself.req.body.url;
  var type = _nself.req.body.type;
  var user = _nself.getCurrentUserInfo(_nself);
  var userSvc = new userService();
  userSvc.on("done", function(code,msg,result,errValue){
    _nself.processJson(code,msg,result,errValue);
  });
  var data = {
   "agentId": user.irxId,
   "lastVisited":{
      "name":name,
      "url":url,
      "type":type,
      "date":new Date()
     }
  }
  userSvc.addLastVisited(data);
}

/*
* List last visited pages
*/

userController.listLastVisited = function(){
  var _nself = this;
  var user = _nself.getCurrentUserInfo(_nself);
 
  var userSvc = new userService();
  userSvc.on("done", function(code,msg,result,page){
    _nself.processJson(code,msg,result,page);
  });

 var data ={
  "irxId" : user.irxId
 }
  userSvc.listLastVisited(data);
}

/*
* check whether this username is available or not
*/
userController.checkUserName = function(){
  var _nself = this;
  var text = _nself.req.params.text;
  var agentId = _nself.getCurrentUser(_nself);
  var userSvc = new userService();
  userSvc.on("done", function(code,msg,result,errValue){
    _nself.processJson(code,msg,result,errValue);
  });
  var data={
    "text":text,
    "id" :agentId
  }
  userSvc.checkUserName(data);
}
/*
*  reset Password
*
**/
userController.changePassword = function() {
  var userSvc = new userService();
  var _nself = this;
  if(this.req.errors.hasError()){
       this.processJson(400,"validation error",this.req.errors.getErrors());
       return;
    }
  userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
  var data={
      "userId":_nself.req.query.userId,
      "code":_nself.req.query.code,
      "password":_nself.req.query.password,
    }

    userSvc.changePassword(data);
}

/*
*  check if user has invitation for invitation
*
**/
userController.hasInvitationForReview = function() {
  var userSvc = new userService();
 
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    
  var  parentId= _nself.req.params.parentId;
  var agentId = _nself.getCurrentUser(_nself);
  var data ={
    "parentId" : parentId,
    "agentId" : agentId
  }
  userSvc.hasInvitationForReview(data);
}


/*
*   List User Projects

*   @TODO : Controller level validation
**/

userController.listReviews = function() {
 
  var _nself = this;
  var userId= _nself.req.params.userId;
  var page = _nself.request.query.page;

  var userSvc = new userService();

   var data= {
      "page":page,
      "userId":userId
    }
    userSvc.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    
    userSvc.listReviews(data);
}  

/*
*   Send User Details

*  
**/

userController.sendUserDetails = function() {
 
  var _nself = this;
  var userId= _nself.req.params.userId;
  var emailId = _nself.req.query.emailId;
  var name = _nself.req.query.name;
  var phoneNum = _nself.req.query.mobileNo;
  if(this.req.errors.hasError()){
       this.processJson(400,"validation error",this.req.errors.getErrors());
       return;
    }
  var userSvc = new userService();

   var data= {
      "emailId":emailId,
      "userId":userId,
      "name":name,
      "phoneNum":phoneNum
    }
    userSvc.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    
    userSvc.sendUserDetails(data);
} 

/*
*  Claim your profile
*  
**/

userController.claimProfile = function() {
 
  var _nself = this;

  var userSvc = new userService();

   var user = _nself.getCurrentUserInfo(_nself);
    userSvc.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    user.profileId=_nself.req.params.profileId;
    
    userSvc.claimProfile(user);
} 
   module.exports=userController