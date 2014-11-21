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
    
  this.match('login', passport.authenticate('local', {successRedirect:'/templates/baseHeader.html',failureRedirect:'/index.html'}),{via: 'post'});
  this.match('/login1',passport.authenticate('local'),function(req, res) {
                                                         if(req.user){
                                                           // res.json({ "id": req.user._id, "username": req.user.email });
                                                           res.json(req.user );
                                                         }else{
                                                            
                                                         }
                                                       }
            );
  this.match('rest',{ controller: 'first/rest/rest', action: 'main' , via: 'POST' });
  this.match('elasticTest',{ controller: 'first/rest/rest', action: 'elasticTest' , via: 'GET' });
  this.match('create-user',{ controller: 'first/rest/user', action: 'createUser' , via: 'GET' });
  this.match('send-email',{ controller: 'first/rest/email', action: 'sendEmail' , via: 'GET' });
  this.match('send-sms',{ controller: 'first/rest/rest', action: 'sendSms' , via: 'POST' });
  this.root({ controller: 'first/pages', action: 'main' });
}
  