var util = require('util');
var passport = require('passport');

module.exports = function() {
  // Warn of version mismatch between global "lcm" binary and local installation
  // of Locomotive.
  this.env="development";
  this.ROUTING_PREFIX= "HIM_ROUTER_";
  this.SERVER_NODE="n1";
  this.use(passport.initialize());
  this.use(passport.session());

  if (this.version !== require('locomotive').version) {
    console.warn(util.format('version mismatch between local (%s) and global (%s) Locomotive module', require('locomotive').version, this.version));
  }
  this.datastore(require('locomotive-mongoose'));
}
