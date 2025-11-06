let DATA_TYPES = null;
let FEEDBACK_QUESTIONS = null; 

async function loadDataContent(){
    const response = await fetch ("public/json/dataContent.json");
    const data = await response.json(); 
    DATA_TYPES = data.DATA_TYPES;
    FEEDBACK_QUESTIONS = data.FEEDBACK_QUESTIONS;

    console.log("Data loaded:", DATA_TYPES, FEEDBACK_QUESTIONS);

}

function getPersonalityKey(randomness,friendliness,wordiness){
    const r = randomness > 50? 'h' : 'l'; //>=??? 
    const f = friendliness > 50?  'h':'l';
    const w = wordiness > 50? 'h':'l';

    return `${r}-${f}-${w}`;
}

function getPersonalityText(dataType, randomness, friendliness, wordiness){
    const key= getPersonalityKey(randomness,friendliness,wordiness);
    const personalityText = DATA_TYPES[dataType].personalitySlidersTxt[key];
    console.log(personalityText);
    return personalityText;
}

function getChatbotResponses(dataType, randomness,friendliness,wordiness,questionIndex){
    const key= getPersonalityKey(randomness,friendliness,wordiness);
    const responses = DATA_TYPES[dataType].chatbotResponses[key];
     console.log(responses);
     console.log(responses[questionIndex]);
    return responses[questionIndex];
   
}

function getFeedbackQuestions(){
    return FEEDBACK_QUESTIONS; 
}

//helper functions needed:
// [x] converting slider values and returning the personality code (h-l-h,h-h-h...etc.)
// [x] getting the text in the finetuning step that's based on personality
// [x] getting chatbot answers 
// [x] loading feedback qs  ++ need to change in main.js, bc these are currently loading from script.js
