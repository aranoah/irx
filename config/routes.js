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

  /*
  * Login and logout
  */

  this.match("login",{ controller: 'user/rest/user', action: 'login' , via: 'POST' } );
  this.match("logout",{ controller: 'user/rest/user', action: 'logout' , via: 'GET' } );
  this.match('rest',{ controller: 'general/rest/rest', action: 'main' , via: 'POST' });
  
  /*
  * Listing Related urls
  */
  this.match('list-projects',{ controller: 'list/rest/project', action: 'listProjects' , via: 'POST' });
  this.match('list-agents',{ controller: 'list/rest/agent', action: 'listAgents' , via: 'POST' });
  /*
  * User Related urls
  */
  this.match('create-user',{ controller: 'user/rest/user', action: 'createUser' , via: 'POST' });
  this.match('update-user/:userId',{ controller: 'user/rest/user', action: 'updateUser' , via: 'POST' });
  this.match('user-details/:userId',{ controller: 'user/rest/user', action: 'getUserDetails' , via: 'GET' });
  this.match('verify-user',{ controller: 'user/rest/user', action: 'verifyUser' , via: 'GET' });
  this.match('list-user-projects/:userId',{ controller: 'user/rest/user', action: 'listUserProjects' , via: 'GET' });
  this.match('list-user-locations/:userId',{ controller: 'user/rest/user', action: 'listUserLocations' , via: 'GET' });

  /*
  * Utility urls
  */
  this.match('elasticTest',{ controller: 'general/rest/rest', action: 'elasticTest' , via: 'GET' });
  this.match('send-email',_app_context.cansec.restrictToLoggedIn,{ controller: 'email/rest/email', action: 'sendEmail' , via: 'GET' });
  this.match('send-sms',{ controller: 'general/rest/rest', action: 'sendSms' , via: 'POST' });
  this.match('s3-test',{ controller: 'general/rest/rest', action: 's3Test' , via: 'GET' });

  /*
  * Profile management urls
  */

  this.match('associate-project/:userId/:projectId',{ controller: 'profile/rest/profileManagement', action: 'associateProject' , via: 'GET' });
  this.match('delete-project/:userId/:projectId',{ controller: 'profile/rest/profileManagement', action: 'deleteProject' , via: 'GET' });
  this.match('list-project',{ controller: 'profile/rest/profileManagement', action: 'listProject' , via: 'GET' });
  this.match('project-autocomplete',{ controller: 'profile/rest/profileManagement', action: 'projectAutocomplete' , via: 'GET' });
  
  // mark-distress
  // array of object having bhks which have been marked distress
  this.match('mark-distress',{ controller: 'profile/rest/profileManagement', action: 'markDistress' , via: 'GET' });
 
  /*
  * User related web urls
  */
  this.root({ controller: 'general/pages', action: 'main' });
  this.match("public-profile",{controller: 'profile/public', action:'main', via:'GET'});
  this.match("agent-listing",{controller: 'irx/agent', action:'main', via:'GET'});
  this.match("project-listing",{controller: 'irx/project', action:'main', via:'GET'});
  this.match(":userId",{controller: 'profile/public', action:'main', via:'GET'});
}
  