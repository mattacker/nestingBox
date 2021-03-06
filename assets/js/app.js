/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */
var pageTitle = '',
    updateCount = 0,
    hasFocus=document.hasFocus();


(function (io) {

  // as soon as this file is loaded, connect automatically,
  var color;
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }

  pageTitle = document.title;
  socket.get('/picture', null);

  socket.on('connect', function socketConnected() {

    // Listen for Comet messages from Sails
    socket.on('message', function messageReceived(message) {

      ///////////////////////////////////////////////////////////
      // Replace the following with your own custom logic
      // to run when a new message arrives from the Sails.js
      // server.
      ///////////////////////////////////////////////////////////
      //log('New comet message received :: ', message);
      //log('New comet message received :: ', 'movementDetected' in message);
      //////////////////////////////////////////////////////
        if('movementDetected' in message) {
            //console.log('Bewegung erkannt 1');
            if(message.movementDetected == true) {
                //console.log('Bewegung erkannt');
                color = $('.blog-masthead').css('background-color');
                $('.blog-masthead').css('background-color', '#333');
            } else {
                $('.blog-masthead').css('background-color', color)
            }

        } else if(message.model == 'picture'){
            if(message.verb == 'create'){
                //console.log('edit count '+hasFocus);
  		        if(!hasFocus) {
                    updateCount++;
                    document.title = '('+updateCount+') '+pageTitle;
                }
                document.getElementById('birdMessage').load();
                document.getElementById('birdMessage').play();
                var child = '<div id="pic_'+message.data.id+'" class="col-lg-6 col-md-6 col-xs-12">' +
                                '<div class="thumbnail">' +
                                    '<a rel="imagegroup" href="/public/birdimage/normal/'+message.data.filename+'" class="picture" title="'+message.data.date+'">' +
                                        '<img src="/public/birdimage/thumbs/'+message.data.filename+'" alt="'+message.data.date+'" class="img-responsive">' +
                                    '</a>' +
                                    '<div class="caption">' +
                                        '<div class="text">'+message.data.date+' <span class="label label-default">New</span></div>' +
//                                        '<hr>' +
//                                        '<div class="actions">' +
//                                            '<a onclick="return false;" href="" class="red">' +
//                                                '<span class="glyphicon glyphicon-floppy-disk"></span>' +
//                                            '</a>' +
//                                            '<a onclick="return deletePicture('+message.data.id+');" href="">' +
//                                                '<span class="glyphicon glyphicon-remove"></span>' +
//                                            '</a>' +
//                                        '</div>'
                                    '</div>' +
                                '</div>' +
                            '</div>';
                //console.log(child);

                var timelineBody = $('#last-timeline-body');
                var timestampOfLastImages = timelineBody.data('timestamp');
                var currentTime = new Date();
//                var timeDifferenceHours = ( currentTime - timestampOfLastImages ) / 1000 / 60 / 60
                if(currentTime.getHours() > new Date(timestampOfLastImages).getHours()) {
                    var liClass = 'timeline-inverted';
                    if(timelineBody.parents('.time').hasClass('timeline-inverted'))
                        liClass = '';
                    timelineBody.removeAttr('id')

                    var timelineElement = '<li class="time '+liClass+'">' +
                                            '<div class="timeline-badge"><i class="glyphicon glyphicon-camera"></i></div>' +
                                            '<div class="timeline-panel">' +
                                                '<div class="timeline-heading">' +
                                                    '<h4 class="timeline-title">Aufnahmen ab '+currentTime.getHours()+' Uhr</h4>' +
                                                    '<p><small class="text-muted timeline-timestring"><i class="glyphicon glyphicon-time"></i><span class="timestring"> gerade eben</span></small></p>' +
                                                '</div>' +
                                                '<div id="last-timeline-body" data-timestamp="'+currentTime+'" class="timeline-body">' +
                                                '</div>' +
                                            '</div>' +
                                           '</li>';
                    $('.timeline').prepend(timelineElement)
                }
                var lastTimelineBody = $('#last-timeline-body');
                lastTimelineBody.prepend(child);
                lastTimelineBody.parent().find('.timestring').html(' vor 1 Sekunde');
                var elements = $('#images').find('.thumbnail')

		        var activityIndicatorOn = function() {
                    $( '<div id="imagelightbox-loading"><div></div></div>' ).appendTo( 'body' );
                },
                activityIndicatorOff = function() {
                    $( '#imagelightbox-loading' ).remove();
                },
                overlayOn = function()
                {
                    $( '<div id="imagelightbox-overlay"></div>' ).appendTo( 'body' );
                },
                overlayOff = function()
                {
                    $( '#imagelightbox-overlay' ).remove();
                },
                closeButtonOn = function( instance )
                {
                    $( '<a href="#" id="imagelightbox-close">Close</a>' ).appendTo( 'body' ).on( 'click', function(){ $( this ).remove(); instance.quitImageLightbox(); return false; });
                },
                closeButtonOff = function()
                {
                    $( '#imagelightbox-close' ).remove();
                },
                captionOn = function()
                {
                    var description = $( 'a[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"] img' ).attr( 'alt' );
                    if( description.length > 0 )
                        $( '<div id="imagelightbox-caption">' + description + '</div>' ).appendTo( 'body' );
                },
                captionOff = function()
                {
                    $( '#imagelightbox-caption' ).remove();
                };
                    $( 'a.picture' ).imageLightbox(
                    {
                          selector:       'id="imagelightbox"',   // string;
                          allowedTypes:   'png|jpg|jpeg|gif',     // string;
                          animationSpeed: 250,                    // integer;
                          preloadNext:    true,                   // bool;            silently preload the next image
                          enableKeyboard: true,                   // bool;            enable keyboard shortcuts (arrows Left/Right and Esc)
                          quitOnEnd:      false,                  // bool;            quit after viewing the last image
                          quitOnImgClick: false,                  // bool;            quit when the viewed image is clicked
                          quitOnDocClick: true,                   // bool;            quit when anything but the viewed image is clicked
                          onStart:        function() { overlayOn(); },                  // function/bool;   calls function when the lightbox starts
                          onEnd:          function() { overlayOff(); captionOff(); activityIndicatorOff(); },                  // function/bool;   calls function when the lightbox quits
                          onLoadStart:    function() { captionOff(); activityIndicatorOn(); },                  // function/bool;   calls function when the image load begins
                          onLoadEnd:      function() { captionOn(); activityIndicatorOff(); }                   // function/bool;   calls function when the image finishes loading
                    });

                }
            }

        });


        ///////////////////////////////////////////////////////////
        // Here's where you'll want to add any custom logic for
        // when the browser establishes its socket connection to
        // the Sails.js server.
        ///////////////////////////////////////////////////////////
        /*log(
            'Socket is now connected and globally accessible as `socket`.\n' +
            'e.g. to send a GET request to Sails, try \n' +
            '`socket.get("/", function (response) ' +
            '{ console.log(response); })`'
        );*/
        ///////////////////////////////////////////////////////////


    });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);

$(document).ready(function() {
    document.getElementById('birdMessage').load();
});

window.onfocus = function() {
    //console.log('Focus erhalten: '+pageTitle+' - '+document.title);
    hasFocus = true;
    if(document.title != pageTitle) {
        updateCount = 0;
        document.title = pageTitle;
    }
}
window.onblur = function() {
     //console.log('lost Focus');
     hasFocus = false;
};
