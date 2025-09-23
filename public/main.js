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
function renderStep(step) {
  let currentContainer;

  if (step.index === "1") {
    document.querySelector(".navbar").style.display = "flex";
    currentContainer = document.getElementById("intro-container");
    currentContainer.style.display = "flex";
    document.getElementById("main-container").style.display = "none";
  } else {
    document.querySelector(".navbar").style.display = "none";
    currentContainer = document.getElementById("main-container");
    document.getElementById("intro-container").innerHTML = "";
    document.getElementById("intro-container").style.display = "none";
    currentContainer.style.visibility = "visible";
    currentContainer.style.display = "flex";
    console.log(currentContainer.style);
    // const topDiv = document.createElement("div");
    // topDiv.classList.add("top");

    // //need browser styling classes
    // for (let i = 0; i < 3; i++) {
    //   const dot = document.createElement("span");
    //   dot.classList.add("dot");
    //   topDiv.appendChild(dot);
    //   console.log("here");
    // }
    // currentContainer.appendChild(topDiv);
    // console.log("and here");
  }

  currentContainer.innerHTML = ""; //NOTE that this clears DOM elements
  currentContainer.className = "";

  if (step.additionalClasses) {
    step.additionalClasses.forEach((c) => {
      currentContainer.classList.add(c);
    });
  }

  //maybe separate intro from everything else that's in a browser -- ANOTHER if, so intro-container vs main-container

  //Maybe for styled text in the middle of paragraph can use regex instead of having full html tags in json

  if (step.title) {
    const h2 = document.createElement("h2");
    h2.innerHTML = step.title;
    currentContainer.appendChild(h2);
  }

  if (step.body) {
    step.body.forEach((p) => {
      const para = document.createElement("p");
      para.textContent = p.text;
      if (p.id) para.id = p.id;
      if (p.class) para.classList.add(p.class);
      currentContainer.appendChild(para);
    });
  }

  if (step.buttons) {
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-group");
    step.buttons.forEach((b) => {
      const btn = document.createElement("button");
      btn.textContent = b.text;
      if (b.id) btn.id = b.id;
      if (b.class) btn.classList.add(b.class);

      btn.addEventListener("click", () => handleTrigger(b.trigger));
      buttonDiv.appendChild(btn);
      
    });
    currentContainer.appendChild(buttonDiv);
  }

  if(step.interactiveBody){
    const interactiveBodyDiv = document.createElement("div");
    interactiveBodyDiv.classList.add("interactive-body");
    step.interactiveBody.forEach((i) => {
      const para = document.createElement("p");
      para.textContent = i.text;
      if (i.id) para.id = i.id;
      if (i.class) para.classList.add(i.class);
      interactiveBodyDiv.appendChild(para);
      
    });
    currentContainer.appendChild(interactiveBodyDiv);
  }
}

function handleTrigger(trigger) {
  const step = scriptByTrigger[trigger] || scriptByIndex[parseInt(trigger)];

  if (step) {
    renderStep(step);
  } else {
    console.log("what to do here");
  }
}

window.addEventListener("DOMContentLoaded", loadScript);
