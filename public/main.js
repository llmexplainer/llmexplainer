let scriptData = [];
let scriptByIndex = {};
let scriptByTrigger = {};
let UIData = {};

async function loadScript() {
  try {
    const response = await fetch("json/script.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const jsonData = await response.json();
    //entire script raw json
    scriptData = jsonData.script;
    UIData = jsonData.ui;
    populateUI(UIData);

    //sort into index and trigger steps
    for (let s of scriptData) {
      if (s.index != null) {
        scriptByIndex[parseInt(s.index)] = s;
      }
      if (s.trigger != null) {
        scriptByTrigger[s.trigger] = s;
      }
    }

    console.log("1.", scriptByIndex, "\n2.", scriptByTrigger); //all good

    renderStep(scriptByIndex[1]);
  } catch (error) {
    console.error("Failed to load script:", error);
  }

}

function populateUI(UIData) {
  //def needs to be something more dynamic for ui...
  document.querySelector("#navbar-title").textContent = UIData.navbar.title;
  document.querySelector("#navbar-resources").textContent =
    UIData.navbar.resources;
  document.querySelector("#navbar-about").textContent = UIData.navbar.about;
  document.querySelector("#navbar-lang").textContent = UIData.navbar.language;
}

//display current step

function renderStep(step){

    //start step, intro container 
    if (step.index === "1") {
    document.querySelector(".navbar").style.display = "flex";
    currentContainer = document.getElementById("intro-container");
    currentContainer.style.display = "flex";
    document.getElementById("main-container").style.display = "none";
  } else {
    //browser styling made visible, navbar hidden
    document.querySelector(".browser-window").style.visibility="visible";
    document.querySelector(".navbar").style.display = "none";
    currentContainer = document.getElementById("main-container");
    document.getElementById("intro-container").innerHTML = "";
    document.getElementById("intro-container").style.display = "none";
    currentContainer.style.visibility = "visible";
    currentContainer.style.display = "flex";
  }

  currentContainer.innerHTML = "";
  currentContainer.className = "";

  //additional classes 
  if(step.additionalClasses){
    step.additionalClasses.forEach((c) => {
        currentContainer.classList.add(c);
    });
  }

  if (step.title) {
    const h2 = document.createElement("h2");
    h2.innerHTML = step.title;
    currentContainer.appendChild(h2);
  }


  //all content renderers are in a look up table. This solves the issue of being limited in layout. 
  //In JSON, we can define an order and it puts things together accordingly. As opposed to having to do text > buttons all the time, for eg 

  //if it is a timed step, it's handled here, and it reads from a "timer" key in the corresponding step. duration here is in ms. 
   if (step.timer) {
  setTimeout(() => {
    handleTrigger(step.timer.trigger);
    console.log("hi");
  }, step.timer.duration);
}

  const contentRenderers = {


    body: () => {

        if (step.body){
            step.body.forEach((p) => {
      const para = document.createElement("p");
      if (p.id) para.id = p.id;
      //adding extra classes for styling, this is for classes that are specific to the element, such as the paragraph, 
      // they exist in an array in the element key-value pair in the json. eg: {"text": "llms xyz", "class":["fade-in","another-class"]} 
      if (p.class) {
  p.class.forEach(cls => para.classList.add(cls));
}
//        if (p.delay) {
//         console.log("yup");
//   para.style.animationDelay = `${p.delay}s`;
// }

      if (p.animation === 'typewriter'){
        //delay was kind of a patchy addition, if i didnt want the typing to start immediately. this is also in ms. 
        const delay = p.delay || 0;
        setTimeout(()=> {
          typewriterEffect(para, p.text, p.speed || 50);
        },delay);
      } else {
        para.textContent = p.text;
      }
      currentContainer.appendChild(para);
    });
        }
    },

 interactiveBody: () => {

    if(step.interactiveBody){
    const interactiveBodyDiv = document.createElement("div");
    interactiveBodyDiv.classList.add("interactive-body");

      //again any additional classes for specific p elements or so
    if (step.interactiveBodyClass){
      step.interactiveBodyClass.forEach(cls => interactiveBodyDiv.classList.add(cls));
    }

    //this is to avoid rendering an empty div and making it visiblle before anything is populated it's looked at through this variable and a "has-content" class
    let hasImmediateContent = false;

    step.interactiveBody.forEach((i) => {
      const para = document.createElement("p");
      if (i.id) para.id = i.id;
      if (i.class) {
        i.class.forEach(cls => i.classList.add(cls));
      }
     
      if ( i. animation === 'typewriter'){
        const delay = i.delay || 0;
        setTimeout(() =>{
          interactiveBodyDiv.classList.add('has-content');
        typewriterEffect(para, i.text, i.speed || 50);
      }, delay);
        } else {
          para.textContent = i.text;
          hasImmediateContent = true;
        }

      interactiveBodyDiv.appendChild(para);
      
    });

    if(hasImmediateContent){
      interactiveBodyDiv.classList.add('has-content');
    }
    currentContainer.appendChild(interactiveBodyDiv);
  }


 },
 
 buttons: () => {
   if (step.buttons) {
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-group");

    step.buttons.forEach((b) => {
      const btn = document.createElement("button");
      btn.textContent = b.text;
      if (b.id) btn.id = b.id;
      if (b.class){
        b.class.forEach(cls => btn.classList.add(cls));
      }

      if (b.delay) {
        console.log("yeahyeah");
        //a patchy fix for wanting buttons to delay even more thru css animations and the "delay" key in the json. For buttons, delay is in the button object and it's written as a STRING e.g: "7.0s", with the unit.
  btn.style.setProperty('--extra-delay', b.delay);
}

      btn.addEventListener("click", () => handleTrigger(b.trigger));
      buttonDiv.appendChild(btn);
      
    });
  
      currentContainer.appendChild(buttonDiv);
   
    
  }

    
 }

  };

  const renderOrder = step.order || ["body", "interactiveBody", "buttons"];

  renderOrder.forEach(contentType => {
    if (contentRenderers[contentType]){
        contentRenderers[contentType]();
    }
  });
 

}

function handleTrigger(trigger) {
  const step = scriptByTrigger[trigger] || scriptByIndex[parseInt(trigger)];
  console.log(step);

  if (step) {
    renderStep(step);
  } else {
    console.log("what to do here");
  }
}

function typewriterEffect(element,text,speed = 50, callback){
  element.textContent= '';
  element.classList.add('typewriter');

  let i = 0;
  const timer = setInterval(() => {

    element.textContent += text[i];
    i++;
    if (i>= text.length){
      clearInterval(timer);
      element.classList.add('done');
      if (callback) callback (); 
    }
  }, speed); 
}

window.addEventListener("DOMContentLoaded", loadScript);
