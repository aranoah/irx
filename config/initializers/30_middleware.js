/***********************************************************************
*
* DESCRIPTION :
*      Locomotive configurations
*  
* Copyright :
*   Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*   Puneet (puneet@aranoah.com)      
*
* START DATE :    
*   11 Nov 2014
*
* CHANGES :
*
**/
var express = require('express')
  , poweredBy = require('connect-powered-by');
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var hashAlgo = require(_path_util+"/sha1.js");
var cors=require("cors");
var messages = require(_path_env+'/message');
var device = require('express-device');
var userService = require(_path_model+"/../service/userService.js");
 

module.exports = function() {
  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  if ('development' == this.env) {
    this.use(express.logger());
    
  }
  var cs = require('cansecurity'), cansec = cs.init({
    validate: function(login,password,callback){
        console.log( "hey i am validate function",login,password);
        var User = IRXUserProfileModel;
        var hashPassword = hashAlgo.SHA1(password);

        User.findOne({"userId":login,"password":hashPassword.toString()},function(err,user){
          if(err){
            callback(false,null,"Invalid Credentials");  
          }else{
            if(user && user != null){
                callback(true,user,user.name);
            }else{
                callback(false,null,"Invalid session please login");
            }
            
          }
        })
        
    },
    fbValidate:function(login,password,callback,res){
           var us = new userService();
           us.once("done",
                            function(code,msg,user,errValue){
                         if(code==0){
                              callback(true,user,user.name);
                         }else{
                              callback(false,null,"Unable to login via fb, try later"); 
                         }
          });
           us.fbRegisterUser(res);
     },
     sessionKey:"agf67dchkQ!",
     authCallback:function(req,res,status,msg,funName){
             console.log("funName:",funName)
             var message=messages[funName];
              if(!message || message == null){
                  message = msg;
              }
              res.send(200,{status:status,message:(message)});
             
            
        },debug:true    
    }
 );

  this.use(poweredBy('Locomotive'));
  this.use(express.favicon());
  this.use(express.static(__dirname + '/../../public'));
  this.use(cors());
  global._app_context.cansec = cansec;
  
  this.use(express.cookieParser());
  this.use(express.session({secret: 'aniyus'}));
  this.use(express.bodyParser());
  this.use(express.methodOverride());
  this.use(cansec);
  this.use(device.capture());
  this.use(function(req, res, next) {
    res.locals.req = req;
    if(req.session['X-CS-Auth']){
        res.locals.session = req.session['X-CS-Auth'];
      } else{
          res.locals.session = {};
      }
     global._app_context.logger.log("shshshhshshshs---->",req.device);
      console.log("shshshhshshshs---->",req.device);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
  this.use(this.router);
  this.use(function(err, req, res, next){
      if (req.xhr) {
        res.status(500).send({ error: 'Something blew up!' });
      } else {
        console.log(err);
      } 
  });
//  this.use(express.errorHandler());
  
}
