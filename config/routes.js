// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.

var passport = require('passport');

module.exports = function routes() {
  function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/login');
    }
    
    this.match('login', passport.authenticate('local', { successRedirect: '/templates/baseHeader.html',failureRedirect: '/index.html' }),{ via: 'post' });
    this.match('rest',{ controller: 'first/rest/rest', action: 'main' });
    this.root({ controller: 'first/pages', action: 'main' });

   /****

   **/



   /***

   **/
}
