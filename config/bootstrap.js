/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
var passport = require('passport')
    ,LocalStrategy = require('passport-local').Strategy
    ,http = require('http')

var user = {
    id: 1,
    username: 'testuser'
}

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        done(null, user);
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
//            console.log('check user ooooolllldddddd '+username);
            // Find the user by username. If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message. Otherwise, return the
            // authenticated `user`.

            if(username == 'testuser' && password == 'xyz') {
                return done(null, user);
            }else {
                return done(null, false, { message: 'Unknown user ' + username });
            }
        }
    ));

  cb();
};