
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
    talk('Yo My Name is FRANKY')
}

$("#current-word").bind("DOMSubtreeModified", function(){
    var string = "http://127.0.0.1:5000/?previousWord="+sentence+"&currentText="+word;
    $.get(string, function(list){
        for (var i=0; i<list.length; i++){
            var buttonstring = "<button class='predictive-button'>" + list[i] + "</button>";
            document.getElementById("buttons").innerHTML(buttonstring);
        }


    });
});
