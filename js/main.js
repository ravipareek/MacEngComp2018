
/**
* This is the client side main js file.
*/

/**
* Global Variables
* @param {string} word - this is the word being constructed by the gesture based keyboard
* @param {string} sentence - this is the sentence being constructed by the words
* @param {string} capFlag - Flag to check capitalization
**/
var word = "";
var sentence = "";
var capFlag = true;

/**
* Request
* this is what a sample event will look like coming from keyboard.js
**/

var event = new CustomEvent('gesture-complete', { detail: {type:"letter", data:"A"}});
dispatchEvent(event);

/**
* Keyboard event listener
* @param {json} e - incoming json from event
{
    detail: {type: "letter",
             data: "A"}
    }
**/
addEventListener('gesture-complete', function (e) {
    // console.log(e.detail.data);

    switch(e.detail.type) {
        case "letter":
        if (capFlag){
            word += e.detail.data.toUpperCase();
            capFlag = false;
        }else{
            word += e.detail.data;
        }

        printword();
        break;
    case "gesture":
        switch (e.detail.data) {
            case "back":
                word = word.slice(0, word.length-1);
                printword();
                break;
            case "delete":
                word = ""
                printword();
                break;
            case "done":
                var message = word + " ";
                sentence += message;
                word = "";
                printsentence();
                printword();
                break;
            case "submit":
                if (word != ""){
                    var message = word + ". ";
                    sentence += message;
                    word = "";
                    capFlag = true;
                    printsentence();
                    printword();
                }

                break;

            default:
                break;
        }
        break;
    default:
        break;

}


}, false);


/**
* Print Word
* Takes Global param Word and prints it to the screen
**/
function printword(){
    var worddiv = document.getElementById("current-word");
    worddiv.innerText = word;
}
/**
* Print Sentence
* Takes Global param sentence and prints it to the screen
**/
function printsentence(){
    var sentencediv = document.getElementById("current-message");
    sentencediv.innerText = sentence;
}

function speak(){
    var audio = new Audio('audio.wav');
    audio.play();
}

$("#1").click(function(){
    $.get("http://127.0.0.1:5000/?previousWord=what&currentText=ar", function(list){
        alert(list[0]);
    });
});


// $.ajax({
//     contentType: 'application/json',
//     accept: 'audio/wav',
//     type: 'POST',
//     dataType: 'json',
//     //async: true,
//     username: "377b8f32-195d-474f-88c7-6c6085b76b9a",
//     password: "aFSPXCqJUuU4",
//     url: 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize',
//     data: {
//        text: sentence
//     },
//     output: 'audio.wav',
//     error: function (data) {
//         console.log(data);
//     },
//     success: function (data) {
//         var audio = new Audio('audio.wav');
//         audio.play();
//     }
// });
