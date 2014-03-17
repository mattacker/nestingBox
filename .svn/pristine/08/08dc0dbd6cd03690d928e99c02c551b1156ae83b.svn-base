/**
 * Picture
 *
 * @module      :: Model
 * @description :: This Model represents the pictures and movies, taken by the motion software
 */

module.exports = {

  attributes: {
      id: 'integer',
      camera: 'integer',
      filename: 'string',
      frame: 'integer',
      file_type: 'integer',
      time_stamp: 'datetime',
      text_event: 'datetime',
      isBackuped: 'integer',
      fullFileName: function() {
          var extension;
          switch(this.file_type) {
              case 1:
              case 2:
                  extension = 'jpg';
                  break;
              case 8:
                  extension = 'ogg';
                  break;
          }
          return this.filename + '.' + extension;
      }
  }

};
