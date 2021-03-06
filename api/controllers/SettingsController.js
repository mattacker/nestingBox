/**
 * SettingsController
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
    path = require('path'),
    http = require('http'),
    exec = require('child_process').exec;


module.exports = {

    index: function (req, res) {
        var cameraConnectionOptions = {
            host : sails.config.cameraServer.ip,
            port : sails.config.cameraServer.port,
            path : '',
            method : 'GET'
        }
        readSizeRecursive(__dirname +'/../../public/birdimage/normal', function(err, size){
            getSetting('threshold', cameraConnectionOptions, function(threshold){
                getSetting('width', cameraConnectionOptions, function(width){
                    getSetting('height', cameraConnectionOptions, function(height){
                        getDetectionState(cameraConnectionOptions, function(state){
                            Picture.count().where({ or: [{file_type: 1 }, {file_type: 2}]}).exec(function(err, numImages){
                                Picture.count().where({ or: [{file_type: 1 }]}).exec(function(err, numVideos){
                                    getPiTemperature(function(temp){
                                        return res.render('settings/index', {
                                            usedMemory: Math.round(size / 1000000.0),
                                            threshold: threshold,
                                            picCount: numImages,
                                            videoCount: numVideos,
                                            resolution: width + ' x ' + height,
                                            detectionState: state,
                                            serverIp: sails.config.serverIp,
                                            temp: temp
                                        });
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    },
    startBackupPhoto: function (req, res) {
        var backupPhoto = exec(__dirname +'/../../bashscripts/backupPhoto '+sails.config.ftp.url+' '+sails.config.ftp.user+' '+sails.config.ftp.password, function(err, stdout, stderr){
            if(err) {
                //res.send({error:{id:1, message:'Keine neuen Daten vorhanden'}})
            }
            //res.send({});
        });
        backupPhoto.on('exit', function (code) {
            console.log('Child process exited with exit code '+code);
            switch(code) {
                case 0:
                    res.send({});
                    break;
                case 1:
                    res.send({error:{id:1, message:'Keine neuen Daten vorhanden'}})
                    break;

                case 2:
                    res.send({error:{id:1, message:'Fehler aufgetreten'}})
                    break;
            }
        });
    },
    startBackupVideo: function (req, res) {
        var backupVideo = exec(__dirname +'/../../bashscripts/backupVideo '+sails.config.ftp.url+' '+sails.config.ftp.user+' '+sails.config.ftp.password, function(err, stdout, stderr){
            if(err) {
                //res.send({error:{id:1, message:'Keine neuen Daten vorhanden'}})
            }
            //res.send({});
        });
        backupVideo.on('exit', function (code) {
            console.log('Child process exited with exit code '+code);
            switch(code) {
                case 0:
                    res.send({});
                    break;
                case 1:
                    res.send({error:{id:1, message:'Keine neuen Daten vorhanden'}})
                    break;

                case 2:
                    res.send({error:{id:1, message:'Fehler aufgetreten'}})
                    break;
            }
        });
    },
    toggleDetectionState: function (req, res) {
        var state = 'start';
        var cameraConnectionOptions = {
            host : sails.config.cameraServer.ip,
            port : sails.config.cameraServer.port,
            path : '',
            method : 'GET'
        }

        if (req.param('state') == 0) {
            state = 'pause';
        }
        cameraConnectionOptions.path = '/0/detection/'+state;
        var req = http.request(cameraConnectionOptions, function(response){
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                res.send();
            });

            response.on('error', function(e) {
            });
        });
        req.end();
    },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SettingsController)
   */
  _config: {}

  
};

function getPiTemperature(callback){

    exec("vcgencmd measure_temp", function(error, stdout, stderr){
        var temp = stdout.split("=")[1]
        callback(temp)
    });
}

function getSetting(key, options, callback) {
    options.path = '/0/config/get?query='+key
    var req = http.request(options, function(response){
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            var value = str.split('\n')[0].split('=')[1];
            callback(value);
        });

        response.on('error', function(e) {
            callback(null)
        });
    });
    req.end();
}

function getDetectionState(options, callback) {
    options.path = '/0/detection/status';
    var req = http.request(options, function(response){
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            var state = str.indexOf('PAUSE') == -1;
            callback(state);
        });

        response.on('error', function(e) {
            callback(null)
        });
    });
    req.end();
}

function readSizeRecursive(item, cb) {
    fs.lstat(item, function(err, stats) {
        if(err)
            console.log(err);
        var total = stats.size;

        if (!err && stats.isDirectory()) {
            fs.readdir(item, function(err, list) {
                async.forEach(
                    list,
                    function(diritem, callback) {
                        readSizeRecursive(path.join(item, diritem), function(err, size) {
                            total += size;
                            callback(err);
                        });
                    },
                    function(err) {
                        cb(err, total);
                    }
                );
            });
        }
        else {
            cb(err, total);
        }
    });
}
