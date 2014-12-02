/***********************************************************************
*
* DESCRIPTION :
*       Controller Mapper
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
var passport = require('passport');

module.exports = function routes() {
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
      return next();
    }
    res.redirect('/login');
  }
  this.match("login",function(req,res,done){
      console.log("i am in login",req.session); 
      _app_context.cansec.validate(req,res,done);
  },{ via:'post',controller: 'first/pages', action: 'main'  } );
  
  this.match('rest',{ controller: 'first/rest/rest', action: 'main' , via: 'POST' });
  this.match('elasticTest',{ controller: 'first/rest/rest', action: 'elasticTest' , via: 'GET' });
  this.match('create-user',{ controller: 'first/rest/user', action: 'createUser' , via: 'POST' });
  this.match('verify-user',{ controller: 'first/rest/user', action: 'verifyUser' , via: 'GET' });
  this.match('send-email',{ controller: 'first/rest/email', action: 'sendEmail' , via: 'GET' });
  this.match('send-sms',{ controller: 'first/rest/rest', action: 'sendSms' , via: 'POST' });
  this.match('s3-test',{ controller: 'first/rest/rest', action: 's3Test' , via: 'GET' });
  this.root({ controller: 'first/pages', action: 'main' });
}
  