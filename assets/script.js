var questions = [
    {
      title: "An array’s length can be evaluated with the what property?",
      multiChoice: [".length", ".log", "the console", ".loop"],
      answer: ".length"
    },
  
    {
      title: "Within a loop, the 'break' keyword may be used to do what?",
      multiChoice: ["break your competitors code", "exit the loop immediately", "repeat the loop", "indicate a stopping condition"],
      answer: "exit the loop immediately"
    },
  
    {
      title: "Properties in a JavaScript oject are often refferred to as what?",
      multiChoice: ["dot walking", "key-value pairs", "nested properties", "undefined"],
      answer: "key-value pairs"
    },
  
    {
      title: "Which array method inserts an element at the end of the array?",
      multiChoice: [".pop()", ".push()", ".length", ".join()"],
      answer: ".push()"
    },
  
    {
      title: "What is a callback function?",
      multiChoice: ["a function that accepts an array as an argument", "I function that performs an HTTP request", "a data type similar to a string or a boolean", "a function that is passed into another function as an argument"],
      answer: "a function that is passed into another function as an argument"
    }
  ];



// a variable for start time
let secondsLeft = 76;

//the element that displays the time
let timer = document.getElementById("timer");

//div for high scores
let scoresDiv = document.getElementById("scores-div");

let buttonsDiv = document.getElementById("buttons")

//button for high scores
let viewScoresBtn = document.getElementById("view-scores")

//start button div
let startButton = document.getElementById("start-button");
startButton.addEventListener("click", setTime);


// variable for the questions title
var questionDiv = document.getElementById("question-div");

// div to hold the results
let results = document.getElementById("results");

// div for the choices
var choices = document.getElementById("choices");


// an array to store high scores; sets empty array to return when strotin the array
let emptyArray = [];

// the array of high scores from local storage
let storedArray = JSON.parse(window.localStorage.getItem("highScores"));

// keeping track of which question we're on
var questionCount = 0;

//keeping score
let score = 0

//Timer starts when the user clicks startButton (see above).
function setTime() {
  displayQuestions();
  let timerInterval = setInterval(function() {
    secondsLeft--;//subtracts secounds in ammount for interval timer
    timer.textContent = "Time: " + secondsLeft;
    if (secondsLeft <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval);
      captureUserScore();
    } 
  }, 1000);
}

//function to load the questions on the page
function displayQuestions() {
  removeEls(startButton);
// sets up moving to next question by checking the question count is the same number of question array in the questions object.
  if (questionCount < questions.length) {
    questionDiv.innerHTML = questions[questionCount].title;
    choices.textContent = "";
//This sets the loop for the each questions
    for (let i = 0; i < questions[questionCount].multiChoice.length; i++) {
      let el = document.createElement("button");//creates button for choices.
      el.innerText = questions[questionCount].multiChoice[i];// adds the text for option buttons
      el.setAttribute("data-id", i); // sets the attribute of each option created 
      el.addEventListener("click", function (event) {   //This determines the path and function to "answered click"
        event.stopPropagation();// ends the the function of for the button so it does not effect other buttons.

        if (el.innerText === questions[questionCount].answer) { // if it is the answer then it adds time.
          score += secondsLeft; //adds to scroe variable questions left
        } else { // if answered wrong it subtractws time
          score -= 10; //takes ten points away from score if you miss the score
          secondsLeft = secondsLeft - 15; // subtracts 15 from seconds left if wrong answer.
        }
        
        questionDiv.innerHTML = ""; //black string that targets questio div.

        if (questionCount === questions.length) { // moves to next question until all questions are completed
          return;
        } else {
          questionCount++;
          displayQuestions();
        }
      });
      choices.append(el); //appends the element choices 
    }
  }
}

// this creates the user score
function captureUserScore() {
  timer.remove();
  choices.textContent = "";

  let initialsInput = document.createElement("input");//creates the input box for intials for the 
  let postScoreBtn = document.createElement("input"); //creates button to post your score and 

  results.innerHTML = `You scored ${score} points! Enter initials: `;
  initialsInput.setAttribute("type", "text");//sts the attribute for the initial input space
  postScoreBtn.setAttribute("type", "button");//makes the score button a button type
  postScoreBtn.setAttribute("value", "Post My Score!");//texty within button
  postScoreBtn.addEventListener("click", function (event) { //creates event for the post score
    event.preventDefault();// prevents running of previous button click of the element
    let scoresArray = defineScoresArray(storedArray, emptyArray); //defines scoers array

    let initials = initialsInput.value;//defines intials to the input value
    let userAndScore = { // creates userAndScore variable
      initials: initials,
      score: score,
    };

    scoresArray.push(userAndScore);// adds user and Score to scores Array
    saveScores(scoresArray);// calls saves Scores to strigify them into an array
    displayAllScores();
    clearScoresBtn();
    goBackBtn();
    viewScoresBtn.remove();
  });
  results.append(initialsInput);
  results.append(postScoreBtn);
}

const saveScores = (array) => {// makes variable saves Scores and logs them as a a string.
  window.localStorage.setItem("highScores", JSON.stringify(array));
}

const defineScoresArray = (arr1, arr2) => { //creates array of scores if the array is not null then the array is created, else if it is empty it returns an empty array.
  if(arr1 !== null) {
    return arr1
  } else {
    return arr2
  }
}
// remove Els removes the elements; ... selects all elements; the for loop below looks at elements and then removes those elements. 
const removeEls = (...els) => {
  for (let el of els) el.remove();
}
// creates 
function displayAllScores() {
  removeEls(timer, startButton, results);
  let scoresArray = defineScoresArray(storedArray, emptyArray);
//creates obj to store initials and score then appends scoresDiv to display initial and score
  scoresArray.forEach(obj => { //forEach element in the obj create the initial element and stored Score element.
    let initials = obj.initials;
    let storedScore = obj.score;
    let resultsP = document.createElement("p");//creates paragraph of the after goin through the game.
    resultsP.innerText = `${initials}: ${storedScore}`;//This covers the diplay pulling form tghe variables storedScore and ititials
    scoresDiv.append(resultsP);
  });
}
//what occurs when you click view scores
function viewScores() {
  viewScoresBtn.addEventListener("click", function(event) { //listening for action to run function
    event.preventDefault();
    removeEls(timer, startButton);// removes timer and start button
    displayAllScores();// runs Diplay all scores
    removeEls(viewScoresBtn);//removes view score button
    clearScoresBtn(); //runs clear score button to creater button and functionality of the button
    goBackBtn(); // runs the go back button byu populating the button and the functionality of the button
  });
}

function clearScoresBtn() {    
  let clearBtn = document.createElement("input");//creates the input field
  clearBtn.setAttribute("type", "button");//makes the input element a button 
  clearBtn.setAttribute("value", "Clear Scores");//adds text inside of the button
  clearBtn.addEventListener("click", function(event){
    event.preventDefault();// prevents previous button fuctions from running
    removeEls(scoresDiv);// removes the scoresDiv from HTML and prevents its population
    window.localStorage.removeItem("highScores");//clears scores from local storage
  })
  scoresDiv.append(clearBtn)//replaces the clear button in the with the clearScoreButton 
}

function goBackBtn() {
  let backBtn = document.createElement("input");//creates button element and populates on the web page
  backBtn.setAttribute("type", "button");//makes the input a button
  backBtn.setAttribute("value", "Go Back");//Makes buton read Go back
  backBtn.addEventListener("click", function(event){//adds the event listner to the the button
    event.preventDefault();// removes all previous button EventListners 
    window.location.reload();//relaods the current url
  })
  buttonsDiv.append(backBtn)// sets this button to replace the backbtn
}


viewScores();//runs view scores