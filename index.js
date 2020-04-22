let difficulty = Number(prompt("Enter grid size: "));
let footer = document.querySelector(".footer");
let orderedList = document.querySelector("ol");
let audio = new Audio("sound/right.mp3");
let wrong = new Audio("sound/wrong.mp3");
let getTimeArray = [];
let timeArray = [];
let randomPress = 0;
let gridTemplateStyle = "";
let unshuffledArray = [];
let shuffledArray = [];
let userArray = [];
let isStart = 0;
let milliseconds = 0,
  seconds = 0,
  secondString = "",
  milliString = "";

//There are two arrays - unshuffled (40 elements) and shuffled (38 elements)
//The unshuffled helps keep track of the order of the buttons to clicked
//The shuffled one helps arrange numbers in a random order in the grid

document.getElementById("timerDisplay").innerHTML = "00:000";
startGame();

//Called whenever button is clicked
function buttonClick(key) {
  key = Number(key);

  if (unshuffledArray.indexOf(key) === 0) {
    //Compared against an unshuffled array consisting of numbers from 1 - 40 in order
    if (key === 1) {
      timer(1, false);
    }
    if (key === 4) {
      success();
      timer(0, true);
    }

    unshuffledArray.splice(0, 1);
    //If correct button is clicked it is crossed off from the unsfuffled array
    console.log("Success");
    makeSound(buttonInnerHTML);

    //Checking whether the next number in the sequence is within the grid or not.
    if (shuffledArray.indexOf(key + 1) >= Math.pow(difficulty, 2) - 2) {
      newReplaceButton = document.createElement("button");
      newReplaceButton.innerHTML = key + 1;
      newReplaceButton.id = key + 1;
      newReplaceButton.setAttribute("class", "grid-item");
      newReplaceButton.setAttribute(
        "style",
        "background-color: hsl(185, 60%, " + (85 - key + 1) + "%)"
      );

      //If not then it is exchanged with a number that is already pressed
      newReplaceButton.addEventListener("click", function () {
        buttonInnerHTML = this.innerHTML;
        buttonClick(buttonInnerHTML);
        buttonAnimation(buttonInnerHTML);
      });

      randomPress = Math.ceil(
        Math.random() * (key - 1 - randomPress) + randomPress
      );

      document
        .querySelector(".grid-container")
        .replaceChild(newReplaceButton, document.getElementById(randomPress));
    }
  } else {
    //If incorrect button is clicked
    console.log("Failure");
    gameOver();
    timer(0, false);
  }
}

//function to create an array from 3 - 40
function createArray() {
  let array = [];
  for (var i = 3; i <= 40; i++) {
    array.push(i);
  }
  return array;
}

//function to shuffle the array
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

//This function returns the appropriate styles to be applied depending on the size of the grid chosen by the user
function level() {
  if (difficulty === 4) {
    gridTemplateStyle =
      "grid-template-columns: auto auto auto auto;visibility: visible;";
  } else if (difficulty === 5) {
    gridTemplateStyle =
      "grid-template-columns: auto auto auto auto auto;visibility: visible;";
  } else {
    gridTemplateStyle =
      "grid-template-columns: auto auto auto auto auto auto;visibility: visible;";
  }

  return gridTemplateStyle;
}

//Starts the game
function startGame() {
  container = document.querySelector(".container");
  container.removeChild(document.querySelector(".form"));
  document.querySelector(".grid-container").setAttribute("style", level());

  unshuffledArray = createArray();
  unshuffledArray.unshift(1, 2);
  //Since createArray() function creates only from 3 - 40, 1 and 2 are prepended

  shuffledArray = shuffle(createArray());

  //Buttons 1 and 2 are inserted by default
  //That is why createArray() only creates from 3 - 40 elements
  for (var k = 1; k <= 2; k++) {
    newButton = document.createElement("button");
    newButton.innerHTML = k;
    newButton.id = k;
    newButton.setAttribute("class", "grid-item");
    newButton.setAttribute(
      "style",
      "background-color: hsl(185, 60%," + (85 - k) + "%)"
    );
    document.querySelector(".grid-container").appendChild(newButton);
  }

  //The rest of the buttons (except 1 and 2) are inserted based on the size of the grid
  //Eg. 23 (25 - 2) elements will be inserted if it is a 5 x 5 grid
  for (var j = 0, l = 85; j < Math.pow(difficulty, 2) - 2; j++) {
    let randomNode = document.getElementById(Math.round(Math.random() * j));

    newButton = document.createElement("button");
    newButton.innerHTML = shuffledArray[j];
    newButton.id = shuffledArray[j];
    newButton.setAttribute("class", "grid-item");
    newButton.setAttribute(
      "style",
      "background-color: hsl(185, 60%, " + (l - shuffledArray[j]) + "%)"
    );

    document
      .querySelector(".grid-container")
      .insertBefore(newButton, randomNode);
  }

  buttons = document.querySelectorAll(".grid-item");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      buttonInnerHTML = this.innerHTML;
      buttonClick(buttonInnerHTML);
      buttonAnimation(buttonInnerHTML);
    });
  }
}

//This function is for the timer
function timer(isStart, success) {
  //isStart tells whether the game has started or not and success tells whether
  //the player won or lost the game

  if (isStart === 1) {
    timeVar = setInterval(() => {
      if (milliseconds < 10) {
        milliString = "00" + milliseconds;
      } else if (milliseconds >= 10 && milliseconds < 100) {
        milliString = "0" + milliseconds;
      } else if (milliseconds >= 100 && milliseconds < 1000) {
        milliString = milliseconds;
      } else if (milliseconds === 1000) {
        milliseconds = 0;
        seconds++;
      }

      if (seconds < 10) {
        secondString = "0" + seconds;
      } else if (seconds >= 10) {
        secondString = seconds;
      }

      document.getElementById("timerDisplay").innerHTML =
        secondString + ":" + milliString;
      milliseconds += 25;
    }, 40);
  } else {
    container = document.querySelector(".container");
    container.removeChild(document.querySelector(".grid-container"));
    container.removeChild(document.querySelector(".heading"));
    timePara = document.createElement("p");
    timePara.innerHTML = "Your Time: " + secondString + ":" + milliString;
    container.appendChild(timePara);
    clearInterval(timeVar);

    if (success) {
      //Time is stored in case player successfully counts uptill 40
      storeData(Number(secondString), Number(milliString));
    }
    getData(); //The saved timings are retrieved from localStorage
  }
}

//Function to animate the button when clicked
function buttonAnimation(currentKey) {
  var activeButton = document.getElementById(currentKey);

  activeButton.classList.add("pressed");

  setTimeout(function () {
    activeButton.classList.remove("pressed");
  }, 100);
}

//Function to play sound when clicked
function makeSound() {
  audio.play();
}

//Function called when player presses the wrong button in the sequence
function gameOver() {
  replayButton = document.createElement("button");
  replayButton.setAttribute("type", "submit");
  replayButton.innerHTML = "Replay <i class=fas></i>";
  replayButton.addEventListener("click", () => {
    window.location.reload();
  });
  footer.innerHTML =
    "<img src=" +
    "https://media.giphy.com/media/PkAC8n6IniAKm60VgB/giphy.gif></img>";
  wrong.play();
  footer.appendChild(replayButton);
  document.querySelector("i").classList.add("fa-redo");
}

//Function is called when player completes counting from 1 - 40
function success() {
  footer.innerHTML =
    "<img src=https://media.giphy.com/media/QWSQ1i0ZKupbJxpPMJ/source.gif></img>";
  footer.style = "text-align: left; padding-left: 20%";

  footer.appendChild(replayButton);
  document.querySelector("i").classList.add("fa-redo");
}

//Function to retrieve data from localStorage
function getData() {
  getTimeArray = [];
  if (localStorage.getItem("timeArray") !== null) {
    getTimeArray = JSON.parse(localStorage.getItem("timeArray"));

    getTimeArray.every((time, i) => {
      if (i < 5) {
        var listItem = document.createElement("li");
        listItem.innerHTML =
          time.seconds + " : " + time.milliseconds + " seconds";
        orderedList.appendChild(listItem);
        return true;
      } else {
        return false;
      }
    });
  }
}

//Function to store data into localStorage
function storeData(secs, millisecs) {
  var f = 0;
  timeArray = [];
  var temp = {
    seconds: secs,
    milliseconds: millisecs
  };

  if (localStorage.getItem("timeArray") !== null) {
    timeArray = JSON.parse(localStorage.getItem("timeArray"));

    timeArray.every((time, i) => {
      console.log(time);
      //The timings are sorted before storing
      if (secs < time.seconds) {
        timeArray.splice(i, 0, temp);
        f = 1;
        return false;
      } else if (secs === time.seconds && millisecs <= time.milliseconds) {
        timeArray.splice(i, 0, temp);
        f = 1;
        return false;
      }
      return true;
    });

    if (f === 0) {
      timeArray.push(temp);
    }
  } else {
    timeArray.push(temp);
  }

  localStorage["timeArray"] = JSON.stringify(timeArray);
}
