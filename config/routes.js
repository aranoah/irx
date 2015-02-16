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


  /* Irx-misc */

  this.match("/irx/contact",{controller:'irx-misc/contactus', action:'main', via:'GET'})
  this.match("irx/about",{controller:'irx-misc/aboutus', action:'main',via:'GET'})
  this.match("irx/package",{controller:'irx-misc/package', action:'main',via:'GET'})
  this.match("irx/reset",{controller:'irx-misc/reset', action:'main',via:'GET'})
  this.match("irx/t&c",{controller:'irx-misc/terms', action:'main',via:'GET'})
  this.match("irx/forgot-password",{controller:'irx-misc/forgotpassword', action:'main',via:'GET'})
  this.match("irx/change-password",{controller:'irx-misc/changepassword', action:'main',via:'GET'})
  this.match("irx/verification",{controller:'irx-misc/verification', action:'main',via:'GET'})

  /*
  * Review
  */
  
  this.match("invite-for-review/:userid",{controller: 'user/rest/user',action:'inviteForReview',via:'GET'})
  this.match("/irx/review/:parentId",{controller: 'user/rest/user',action:'review',via:'POST'})
  this.match("/has-invitation/:parentId",{controller: 'user/rest/user',action:'hasInvitationForReview',via:'GET'})
  this.match("/reviews/:userId",{controller: 'user/rest/user',action:'listReviews',via:'GET'})


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
  this.match('city-autocomplete',{ controller: 'list/rest/locationList', action: 'cityAutocomplete' , via: 'GET' });
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
  this.match('update-user',{ controller: 'user/rest/user', action: 'updateUser' , via: 'POST' });
  this.match('user-details/:userId',{ controller: 'user/rest/user', action: 'getUserDetails' , via: 'GET' });
  this.match('verify-user',{ controller: 'user/rest/user', action: 'verifyUser' , via: 'GET' });
  this.match('list-user-projects/:userId',{ controller: 'user/rest/user', action: 'listUserProjects' , via: 'GET' });
  this.match('list-user-locations/:userId',{ controller: 'user/rest/user', action: 'listUserLocations' , via: 'GET' });
  this.match('check-userName/:text',{ controller: 'user/rest/user', action: 'checkUserName' , via: 'GET' });
  this.match('forget-password/:userId',{ controller: 'user/rest/user', action: 'forgetPassword' , via: 'GET' });
  this.match('change-password',{ controller: 'user/rest/user', action: 'changePassword' , via: 'GET' });
  this.match('send-user-details/:userId',{ controller: 'user/rest/user', action: 'sendUserDetails' , via: 'GET' });
  this.match('claim-profile/:profileId',{ controller: 'user/rest/user', action: 'claimProfile' , via: 'GET' });
  /*
  * Utility urls
  */
  this.match('elasticTest',{ controller: 'general/rest/rest', action: 'elasticTest' , via: 'GET' });
  this.match('send-email',{ controller: 'email/rest/email', action: 'sendEmail' , via: 'GET' });
  this.match('send-sms',{ controller: 'general/rest/rest', action: 'sendSms' , via: 'POST' });
  this.match('s3-test',{ controller: 'general/rest/rest', action: 's3Test' , via: 'GET' });

  /*
  * Profile management urls
  */

  this.match('associate-project/:projectId',{ controller: 'profile/rest/profileManagement', action: 'associateProject' , via: 'GET' });
  this.match('delete-project/:projectId',{ controller: 'profile/rest/profileManagement', action: 'deleteProject' , via: 'GET' });
  this.match('list-product/:type',{ controller: 'profile/rest/profileManagement', action: 'listProject' , via: 'GET' });
  this.match('product-autocomplete/:type',{ controller: 'profile/rest/profileManagement', action: 'projectAutocomplete' , via: 'GET' });
  this.match('list-associated-product/:type',{ controller: 'profile/rest/profileManagement', action: 'projectAutocomplete' , via: 'GET' });
  this.match('mark-distress/:projectId',{ controller: 'profile/rest/profileManagement', action: 'markDistress' , via: 'POST' });
  this.match('associate-location/:projectId',{ controller: 'profile/rest/profileManagement', action: 'associateLocation' , via: 'GET' });
  this.match('delete-location/:projectId',{ controller: 'profile/rest/profileManagement', action: 'deleteLocation' , via: 'GET' });
  this.match('reset-password',{ controller: 'profile/rest/profileManagement', action: 'resetPassword' , via: 'GET' });
  
  
  /*
  * Lead Capture related urls
  */
  
  this.match("/capture-lead",{controller: 'leads/rest/leads', action:'captureLeads', via:'POST'});
  this.match("/review-lead-verify/:leadId",{controller: 'leads/rest/leads', action:'reviewLeadVerify', via:'POST'});
  this.match("/lead-delete/:leadId",{controller: 'leads/rest/leads', action:'leadDelete', via:'GET'});
  this.match("/leads",{controller: 'leads/rest/leads', action:'listLeads', via:'GET'});

  /*
  * Project related urls
  */
  
  this.match("/prefered-agents/:projectId",{controller: 'project/rest/projectRest', action:'listPreferedAgents', via:'GET'});
  this.match("/request-details/:projectId",{controller: 'project/rest/projectRest', action:'requestDetails', via:'GET'});
  
  /*
  * Last visited
  */
  
  this.match("add-last-visited",{controller: 'user/rest/user',action:'addLastVisited',via:'POST'})
  this.match("last-visited",{controller: 'user/rest/user',action:'listLastVisited',via:'GET'})
  /*
  * web urls
  */
  

  this.match("public-profile",{controller: 'profile/public', action:'main', via:'GET'});
  // this.match(":userId",{controller: 'profile/public', action:'main', via:'GET'});
  this.match("agent-listing",{controller: 'irx/agent', action:'main', via:'GET'});
  this.match("project-listing",{controller: 'irx/project', action:'main', via:'GET'});
  this.match("/irx/404", {controller:'irx/noResult', action:'main', via:'GET'});

  this.match("project-detailing",{controller: 'irx/projdet', action:'main', via:'GET'});
  this.match("/loginPage",{controller: 'irx/loginPage', action:'main', via:'GET'});
  this.match("/admin/profile" ,{controller: 'admin/profile', action:'main', via:'GET'})
  
  this.match(":userId",{controller: 'profile/public', action:'main', via:'GET'});
  this.match("/project/:projectId",{controller: 'project/project', action:'main', via:'GET'});
  
  /*
  * root
  */
  this.root({controller: 'irx/home', action:'main', via:'GET'});
}
  