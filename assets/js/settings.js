function startBackupPhoto() {
    var xmlhttp;
    if (window.XMLHttpRequest){
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else{
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()	{
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var resonse = JSON.parse(xmlhttp.responseText);
            if('error' in resonse) {
                $('#alertContainer').prepend('<div class="alert alert-danger fade in" id="alert-photo">' +
                    '<button type="button" class="close" data-dismiss="alert">×</button>' +
                    '<strong>Foto-Backup Fehler!</strong> Es gab einen Fehler beim Backup.<br><i>Nachricht:</i> '+resonse.error.message +
                    '</div>');
                $('#alert-photo').addClass('in');
            }else {
                $('#alertContainer').prepend('<div class="alert alert-success fade in" id="alert-video">' +
                    '<button type="button" class="close" data-dismiss="alert">×</button>' +
                    '<strong>Foto-Backup erfolgreich!</strong> Das Backup wurde erfolgreich auf dem FTP-Server abgelegt.' +
                    '</div>');
                $('#alert-photo').addClass('in');
            }
            document.getElementById('loadingDialogPhoto').style.visibility = 'hidden';
            document.getElementById('startBackupPhoto').style.visibility = 'visible';
        }
    };
    document.getElementById('startBackupPhoto').style.visibility = 'hidden';
    document.getElementById('loadingDialogPhoto').style.visibility = 'visible';
    xmlhttp.open("GET","/backup/photo", true);
    xmlhttp.send();
}
function startBackupVideo() {
    var xmlhttp;
    if (window.XMLHttpRequest){
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else{
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()	{
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var resonse = JSON.parse(xmlhttp.responseText);
            //var resonse = {error:{id:1, message:'Keine neuen Daten vorhanden'}};
            if('error' in resonse) {
                $('#alertContainer').prepend('<div class="alert alert-danger fade in" id="alert-video">' +
                    '<button type="button" class="close" data-dismiss="alert">×</button>' +
                    '<strong>Video-Backup Fehler!</strong> Es gab einen Fehler beim Backup.<br><i>Nachricht:</i> '+resonse.error.message +
                    '</div>');
                $('#alert-video').addClass('in');
            }else {
                $('#alertContainer').prepend('<div class="alert alert-success fade in" id="alert-video">' +
                    '<button type="button" class="close" data-dismiss="alert">×</button>' +
                    '<strong>Video-Backup erfolgreich!</strong> Das Backup wurde erfolgreich auf dem FTP-Server abgelegt.' +
                    '</div>');
                $('#alert-video').addClass('in');
            }
            document.getElementById('loadingDialogVideo').style.visibility = 'hidden';
            document.getElementById('startBackupVideo').style.visibility = 'visible';
        }
    };
    document.getElementById('startBackupVideo').style.visibility = 'hidden';
    document.getElementById('loadingDialogVideo').style.visibility = 'visible';
    xmlhttp.open("GET","/backup/video", true);
    xmlhttp.send();
}