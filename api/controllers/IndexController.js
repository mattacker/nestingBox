/**
 * IndexController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  
    /**
    * Action:
    *    `/`
    */
    index: function (req, res) {
        var imagesPerPage = 12;
        var page = req.param('page');
        if(page==undefined)
            page = 1

        Picture.find().where({ or: [{file_type: 1 }, {file_type: 2}]}).sort('time_stamp DESC').limit(imagesPerPage).skip((page-1)*imagesPerPage).done(function(err, pictures){

            Picture.count(function (err, count) {
                if(err) {
                    return consle.log(err);
                }
                var pageCount = count/imagesPerPage
                if(pageCount < 1) {
                    pageCount = 1
                } else if(pageCount <= Math.floor(pageCount)) {
                    pageCount--
                }
                return res.render('home/index', {
                    page: page,
                    maxPage: Math.ceil(pageCount),
                    imagesPerPage: imagesPerPage,
                    pageCount: pageCount,
                    actImages: pictures,
                    serverIp: req.rawHost
                });
            })
        })
    },
    videos: function (req, res) {
        var imagesPerPage = 12;
        var page = req.param('page');
        if(page==undefined)
            page = 1

        Picture.find().where({ or: [{file_type: 8 }]}).sort('time_stamp DESC').limit(imagesPerPage).skip((page-1)*imagesPerPage).done(function(err, pictures){

            Picture.count(function (err, count) {
                if(err) {
                    return consle.log(err);
                }
                var pageCount = count/imagesPerPage
                if(pageCount < 1) {
                    pageCount = 1
                } else if(pageCount <= Math.floor(pageCount)) {
                    pageCount--
                }
                return res.render('home/videos', {
                    page: page,
                    maxPage: Math.ceil(pageCount),
                    imagesPerPage: imagesPerPage,
                    pageCount: pageCount,
                    actImages: pictures,
                    serverIp: req.rawHost
                });
            })
        })
    },
    livestream: function (req, res) {
      return res.render('home/livestream', {
          serverIp: req.rawHost
      });
    },
  movementDetected: function (req, res) {
      var state = false;
      if(req.param('state') == 'start') {
          state = true;
      }
      Picture.publish(req,{movementDetected: state})
      res.send();
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to IndexController)
   */
  _config: {}

  
};
