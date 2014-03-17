/**
 * PictureController
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
var fs = require("fs"),
    http = require('http');

module.exports = {

    /**
     * Action blueprints:
     *    `/picture/get`
     */
    get: function (req, res) {
        res.sendfile(req.path.substr(1));
    },
    take:  function (req, res) {
        var cameraConnectionOptions = {
            host : sails.config.cameraServer.ip,
            port : sails.config.cameraServer.port,
            path : '/0/action/snapshot',
            method : 'GET'
        }
        var req = http.request(cameraConnectionOptions, function(response){
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                console.log('Bild aufgenommen');
                res.send({})
            });

            response.on('error', function(e) {
                console.log('problem with request: ' + e.message);
            });
        });
        req.end();
    },
    pushImage: function (req, res) {
        console.log('Push erhalten');
        Picture.findOne({filename: req.param('pictureFilename')}).done(function(err, picture){
            if(err || picture == undefined){
                console.log(err);
                res.send({fehler:err});
                return;
            }
            var date = new Date(picture.time_stamp)
            Picture.publishCreate({
                id: picture.id,
                filename: picture.fullFileName(),
                date: date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()+' um '+date.getHours()+':'+date.getMinutes()+' Uhr'
            })
            console.log('Push durchgeführt');
            res.send({})
        })

    },
    delete: function (req, res) {
        Picture.findOne(req.param('id')).done(function(err, picture){
            if(err || picture == undefined){
                console.log(err);
                res.send({error:err});
                return;
            }

            picture.destroy(function(err) {
                // record has been removed
                if(err) {
                    console.log('Fehler beim Löschen des Bildes '+err);
                }
                fs.unlink(__dirname +'/../../public/birdimage/normal/'+picture.fullFileName());
                fs.unlink(__dirname +'/../../public/birdimage/thumbs/'+picture.fullFileName());
                res.send(picture);
            });
        })
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PictureController)
   */
  _config: {
      blueprints: {
          actions: true,
          rest: true
      }
  }

  
};
