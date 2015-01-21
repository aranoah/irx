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
  * Review
  */
  
  this.match("invite-for-review/:userid",{controller: 'user/rest/user',action:'inviteForReview',via:'GET'})
  this.match("/irx/review/:parentId",{controller: 'user/rest/user',action:'review',via:'POST'})


  /*
  * Login and logout
  */

  this.match("login",{ controller: 'user/rest/user', action: 'login' , via: 'POST' } );
  this.match("logout",{ controller: 'user/rest/user', action: 'logout' , via: 'GET' } );
  this.match('rest',{ controller: 'general/rest/rest', action: 'main' , via: 'POST' });

  /** newly added **/

  this.match("sell", {controller: 'user/rest/user', action:'sell', via:'POST'});
  this.match("post", {controller: 'user/rest/user', action:'post', via:'POST'});
  this.match("leads", {controller: 'user/rest/user', action:'leads', via:'POST'});
  
  /*
  * Home Page
  */
  this.match('agent-autocomplete',{ controller: 'list/rest/agentList', action: 'agentAutocomplete' , via: 'GET' });
  this.match('autocomplete',{ controller: 'list/rest/projectList', action: 'autocomplete' , via: 'GET' });
  this.match('project-autocomplete',{ controller: 'list/rest/projectList', action: 'projectAutocomplete' , via: 'GET' });

  this.match('irx/home',{ controller : 'irx/home', action:'main', via:'GET'});
  
  /*
  * Listing Related urls
  */
  
  this.match('list-projects-elastic',{ controller: 'list/rest/projectList', action: 'listProjectsElastic' , via: 'POST' });
  this.match('list-projects',{ controller: 'list/rest/projectList', action: 'listProjects' , via: 'POST' });
  this.match('list-agents',{ controller: 'list/rest/agentList', action: 'listAgents' , via: 'POST' });
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
  this.match('list-product/:type',{ controller: 'profile/rest/profileManagement', action: 'listProject' , via: 'GET' });
  this.match('product-autocomplete/:type',{ controller: 'profile/rest/profileManagement', action: 'projectAutocomplete' , via: 'GET' });
  this.match('list-associated-product/:type',{ controller: 'profile/rest/profileManagement', action: 'projectAutocomplete' , via: 'GET' });
  this.match('mark-distress/:projectId',{ controller: 'profile/rest/profileManagement', action: 'markDistress' , via: 'POST' });
   // remove-distress
  // array of object having bhks which have been marked distress
  //this.match('remove-distress/:projectId',{ controller: 'profile/rest/profileManagement', action: 'markDistress' , via: 'GET' });
  /*
  * Lead Capture related urls
  */
  
  this.match("/capture-lead",{controller: 'leads/rest/leads', action:'captureLeads', via:'POST'});
  this.match("/review-lead-verify/:leadId",{controller: 'leads/rest/leads', action:'reviewLeadVerify', via:'POST'});
  this.match("/review-lead-delete/:leadId",{controller: 'leads/rest/leads', action:'reviewLeadDelete', via:'POST'});
  this.match("/leads",{controller: 'leads/rest/leads', action:'listLeads', via:'GET'});

  /*
  * Project related urls
  */
  
  this.match("/prefered-agents/:projectId",{controller: 'project/rest/projectRest', action:'listPreferedAgents', via:'GET'});
  
  /*
  * Last visited
  */
  
  this.match("add-last-visited/:userid",{controller: 'user/rest/user',action:'addLastVisited',via:'POST'})
  /*
  * web urls
  */
  
  this.root({ controller: 'general/pages', action: 'main' });
  this.match("public-profile",{controller: 'profile/public', action:'main', via:'GET'});
  // this.match(":userId",{controller: 'profile/public', action:'main', via:'GET'});
  this.match("agent-listing",{controller: 'irx/agent', action:'main', via:'GET'});
  this.match("project-listing",{controller: 'irx/project', action:'main', via:'GET'});
  this.match("/irx/404", {controller:'irx/noResult', action:'main', via:'GET'});

  this.match("project-detailing",{controller: 'irx/projdet', action:'main', via:'GET'});

  this.match("/admin/profile/:userId", {controller: 'admin/profile', action:'main', via:'GET'})
  
  this.match(":userId",{controller: 'profile/public', action:'main', via:'GET'});
  this.match("/project/:projectId",{controller: 'project/project', action:'main', via:'GET'});

}
  