var voice = "en-US_AllisonVoice";
var format = 'audio/ogg;codecs=opus';
var token = "{authentication-token}";
var wsURI = "wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=" +
    voice + "&watson-token=" + token;

function talk(text) {
    //    Get token for watson
    var http = new XMLHttpRequest();
    var url = 'https://stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/text-to-speech/api';
    http.open('GET', url, true);
    //Send the proper header information along with the request
    //     http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("Authorization", "Basic " + btoa("377b8f32-195d-474f-88c7-6c6085b76b9a:aFSPXCqJUuU4"));
    // http.setRequestHeader("Accept", "audio/wav");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log(http)
            token = http.responseText;
            wsURI = "wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=" +
                voice + "&watson-token=" + token;
            socketGetTextToSpeech(text);
        }
    }
    http.send();
}

// Referenced From
// https://www.ibm.com/watson/developercloud/text-to-speech/api/v1/curl.html?curl#websocket_methods
function socketGetTextToSpeech(text) {
    function onOpen(evt) {
        var message = {
            text: text,
            accept: format
        };
        // The service currently accepts a single message per WebSocket connection.
        websocket.send(JSON.stringify(message));
    }

    var audioParts = [];
    var finalAudio;

    function onMessage(evt) {
        if (typeof evt.data === 'string') {
            console.log('Received string message: ', evt.data)
        } else {
            console.log('Received ' + evt.data.size + ' binary bytes', evt.data.type);
            audioParts.push(evt.data);
        }
    }

    function onClose(evt) {
        console.log('WebSocket closed', evt.code, evt.reason);
        finalAudio = new Blob(audioParts, {type: format});
        console.log('final audio: ', finalAudio);
        var blobUrl = URL.createObjectURL(finalAudio);
        console.log(blobUrl);
        document.getElementById('test').setAttribute( "href", blobUrl );
        audio = new Audio(blobUrl);
        audio.play();
    }

    function onError(evt) {
        console.log('WebSocket error', evt);
    }

    var websocket = new WebSocket(wsURI);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
}