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

<<<<<<< HEAD
  /*
  * Login and logout
  */
=======
>>>>>>> 4b7cd7219f3abb6b1112bbd601309efdda05e8fe
  this.match("login",{ controller: 'user/rest/user', action: 'login' , via: 'POST' } );
  this.match("logout",{ controller: 'user/rest/user', action: 'logout' , via: 'GET' } );
  this.match('rest',{ controller: 'general/rest/rest', action: 'main' , via: 'POST' });
  
  /*
  * User Related urls
  */
  this.match('create-user',{ controller: 'user/rest/user', action: 'createUser' , via: 'POST' });
  this.match('update-user/:userId',{ controller: 'user/rest/user', action: 'updateUser' , via: 'POST' });
  this.match('user-details/:userId',{ controller: 'user/rest/user', action: 'getUserDetails' , via: 'GET' });
  this.match('verify-user',{ controller: 'user/rest/user', action: 'verifyUser' , via: 'GET' });

  /*
  * Utility urls
  */
  this.match('elasticTest',{ controller: 'general/rest/rest', action: 'elasticTest' , via: 'GET' });
  this.match('send-email',_app_context.cansec.restrictToLoggedIn,{ controller: 'email/rest/email', action: 'sendEmail' , via: 'GET' });
  this.match('send-sms',{ controller: 'general/rest/rest', action: 'sendSms' , via: 'POST' });
  this.match('s3-test',{ controller: 'general/rest/rest', action: 's3Test' , via: 'GET' });
  this.root({ controller: 'general/pages', action: 'main' });
  this.match("public-profile",{controller: 'profile/public', action:'main', via:'GET'});
}
  