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
  this.root({ controller: 'first/pages', action: 'main' });
}
  