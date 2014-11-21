/***********************************************************************
*
* DESCRIPTION :
*       Server configuration related properties.
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
var util = require('util');
var passport = require('passport');
var express = require('express');
var expressValidator = require('express-validator');
module.exports = function() {
  // Warn of version mismatch between global "lcm" binary and local installation
  // of Locomotive.
  this.env="development";
  this.ROUTING_PREFIX= "HIM_ROUTER_";
  this.SERVER_NODE="n1";
  this.use(passport.initialize());
  this.use(passport.session());
  this.use(express.bodyParser());
  this.use(expressValidator());

  if (this.version !== require('locomotive').version) {
    console.warn(util.format('version mismatch between local (%s) and global (%s) Locomotive module', require('locomotive').version, this.version));
  }
  this.datastore(require('locomotive-mongoose'));
}
