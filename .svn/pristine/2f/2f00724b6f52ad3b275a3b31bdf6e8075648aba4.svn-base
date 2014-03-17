$(document).ready(function() {

    var activityIndicatorOn = function() {
            $( '<div id="imagelightbox-loading"><div></div></div>' ).appendTo( 'body' );
        },
        activityIndicatorOff = function() {
            $( '#imagelightbox-loading' ).remove();
        },
        overlayOn = function() {
            $( '<div id="imagelightbox-overlay"></div>' ).appendTo( 'body' );
        },
        overlayOff = function() {
            $( '#imagelightbox-overlay' ).remove();
        },
        closeButtonOn = function( instance ) {
            $( '<a href="#" id="imagelightbox-close">Close</a>' ).appendTo( 'body' ).on( 'click', function(){ $( this ).remove(); instance.quitImageLightbox(); return false; });
        },
        closeButtonOff = function() {
            $( '#imagelightbox-close' ).remove();
        },
        captionOn = function() {
            var description = $( 'a[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"] img' ).attr( 'alt' );
            if( description.length > 0 )
                $( '<div id="imagelightbox-caption">' + description + '</div>' ).appendTo( 'body' );
        },
        captionOff = function() {
            $( '#imagelightbox-caption' ).remove();
        };
    var instanceC = $( 'a.picture' ).imageLightbox(
        {
            selector:       'id="imagelightbox"',   // string;
            allowedTypes:   'png|jpg|jpeg|gif',     // string;
            animationSpeed: 250,                    // integer;
            preloadNext:    true,                   // bool;            silently preload the next image
            enableKeyboard: true,                   // bool;            enable keyboard shortcuts (arrows Left/Right and Esc)
            quitOnEnd:      false,                  // bool;            quit after viewing the last image
            quitOnImgClick: false,                  // bool;            quit when the viewed image is clicked
            quitOnDocClick: true,                   // bool;            quit when anything but the viewed image is clicked
            onStart:        function() { overlayOn(); closeButtonOn( instanceC ); },                  // function/bool;   calls function when the lightbox starts
            onEnd:          function() { overlayOff(); closeButtonOff(); captionOff(); activityIndicatorOff(); },                  // function/bool;   calls function when the lightbox quits
            onLoadStart:    function() { captionOff(); activityIndicatorOn(); },                  // function/bool;   calls function when the image load begins
            onLoadEnd:      function() { captionOn(); activityIndicatorOff(); }                   // function/bool;   calls function when the image finishes loading
    });
})

function deletePicture(serverIp, id) {
    if(confirm("Soll das Bild wirklich gelöscht werden?") == true) {
        var xmlhttp;
        if (window.XMLHttpRequest){
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else{
            // code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var deletedPicture = JSON.parse(xmlhttp.responseText);
                if(deletedPicture.id == id) {
                    var elem = document.getElementById('pic_'+id);
                    if(elem.parentNode.childNodes.length==1) {
                        elem = elem.parentNode.parentNode.parentNode
                        var children = elem.parentNode.children
                        if(children.length>1)
                            $(children[1]).find('.timeline-body').attr('id', 'last-timeline-body')
                    }
                    elem.parentNode.removeChild(elem);
                }
            }
        };
        xmlhttp.open("GET","http://"+serverIp+"/picture/delete/"+id, true);
        xmlhttp.send();
    }
    return false;
}