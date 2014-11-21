/***********************************************************************
*
* DESCRIPTION :
*      Passport related configurations . It will be used for authorization and authentication
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
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

// Use the LocalStrategy within Passport.
var hashAlgo = require(_path_util+"/sha1.js")
passport.use(new LocalStrategy({
   usernameField: 'email',
    passwordField: 'password'
},
  function(username, password, done) {
    // Find the user by username.  If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure.  Otherwise, return the authenticated `user`.
    console.log("here .... ");
    var collection = mongoose.getCollection('testUser');
    var hashPassword = hashAlgo.SHA1(password);
  
    collection.findOne({ "email": username,"password":hashPassword.toString() }, function(err, user) {
      if (err) { return done(err); }

      if (!user) {
        console.log('Helooooooo..')
        return done(null, false,{"message":"Failure"});
      }
      return done(null, user);
    });
  }
));

// Passport session setup.

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  Account.findById(id, function (err, user) {
    done(err, user);
  });
});