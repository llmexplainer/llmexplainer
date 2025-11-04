let DATA_TYPES = null;
let FEEDBACK_QUESTIONS = null; 

async function loadDataContent(){
    const response = await fetch ("json/dataContent.json");
    const data = await response.json(); 
    DATA_TYPES = data.DATA_TYPES;

    console.log("Data loaded:", DATA_TYPES);

}


//helper functions needed:
// [] converting slider values and returning the personality
// [] getting the text in the finetuning step that's based on personality
// [] getting chatbot answers 
// [] loading feedback qs