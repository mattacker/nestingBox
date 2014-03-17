/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: This controller is used for authentication
 */

var passport = require('passport');

module.exports = {
  /**
   * Action:
   *    `GET /login`
   */
   login: function (req, res) {
      res.view();
  },
  /**
   * Action:
   *    `POST /login`
   */
  process: function(req, res) {
      passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' })(req, res)
  },


  /**
   * Action:
   *    `/logout`
   */
   logout: function (req, res) {
      req.logout();
      res.redirect('/');
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {}

  
};
