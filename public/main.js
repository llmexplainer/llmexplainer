let scriptData = [];
let scriptByIndex = {};
let scriptByTrigger = {};
let UIData = {};

async function loadScript() {
  const response = await fetch("json/script.json");
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
  const mainContainer = document.getElementById("main-container");
  mainContainer.innerHTML = ""; //clearing anything from before

  if (step.title) {
    const h2 = document.createElement("h2");
    h2.innerHTML = step.title;
    mainContainer.appendChild(h2);
  }

  if (step.body) {
    const p = document.createElement("p");
    p.innerHTML = step.body;
    mainContainer.appendChild(p);
  }

 if (step.buttons) {
  step.buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.text;
    if (b.id) btn.id = b.id;
    if (b.class) btn.classList.add(b.class);

    btn.addEventListener("click", () => handleTrigger(b.trigger));
    mainContainer.appendChild(btn);
  });
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

