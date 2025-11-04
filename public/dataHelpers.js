let DATA_TYPES = null;
let FEEDBACK_QUESTIONS = null; 

async function loadDataContent(){
    const response = await fetch ("json/dataContent.json");
    const data = await response.json(); 
    DATA_TYPES = data.DATA_TYPES;
    FEEDBACK_QUESTIONS = data.FEEDBACK_QUESTIONS;

    console.log("Data loaded:", DATA_TYPES, FEEDBACK_QUESTIONS);

}

function getPersonalityKey(randomness,friendliness,wordiness){
    const r = randomness > 50? 'h' : 'l'; //>=??? 
    const f = friendliness > 50?  'h':'l';
    const w = wordiness > 50? 'h':'l';

    return(`${r}-${f}-${w}`)
}


//helper functions needed:
// [x] converting slider values and returning the personality code (h-l-h,h-h-h...etc.)
// [] getting the text in the finetuning step that's based on personality
// [] getting chatbot answers 
// [] loading feedback qs