

var word = "";
var sentence = "";
var capFlag = true;

// var event = new CustomEvent('gesture-complete', { detail: {type:"letter", data:"B"}});
// dispatchEvent(event);

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
                var message = word + ". ";
                sentence += message;
                word = "";
                capFlag = true;
                printsentence();
                printword();
                break;

            default:
                break;
        }
        break;
    default:
        break;

}


}, false);


function printword(){
    var worddiv = document.getElementById("current-word");
    worddiv.innerText = word;
}

function printsentence(){
    var sentencediv = document.getElementById("current-message");
    sentencediv.innerText = sentence;
}

function speak(){

}
