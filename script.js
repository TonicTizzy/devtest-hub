//fetch html elements:
const questionElement = document.getElementById("question")
const optionsElement  = document.getElementById("options")
const nextBtn = document.getElementById("Nextbtn")
const timerElement = document.getElementById("timer")
const getStartedBtn = document.getElementById("getStartedBtn");
const formContainer = document.getElementById("formContainer");
const startQuizBtn = document.getElementById("startQuizBtn");
const quizContainer = document.getElementById("quizContainer");

//Globala variables:
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 1800;
let timer;

// UPDATED: check element exists before using it
if (getStartedBtn) {
  getStartedBtn.onclick = function () {
    formContainer.style.display = "flex";
  };
}


// UPDATED
if (startQuizBtn) {
  startQuizBtn.onclick = function () {

    const name = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    if (!name || !email) {
      alert("Please fill in all details.");
      return;
    }

    localStorage.setItem("quizTaken", "true");
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    startQuiz();
  };
}

//Load question from the JSOn file:
fetch("questions.json")
  .then(response => response.json())
  .then(data  => {
    questions = shuffleArray(data);
    showQuestion();
    startTimer();
  });

function startQuiz() {

  fetch("questions.json")
    .then(response => response.json())
    .then(data => {
      questions = shuffleArray(data);
      showQuestion();
      startTimer();
    });

}

//Shuffle questions function:
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}  

//Show question function:
function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(index);
    optionsElement.appendChild(button);
  });
}

//Check answer function:
function checkAnswer(selectedIndex) {
  if (selectedIndex === questions[currentQuestionIndex].answer) {
    score++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

//Timer function:
function startTimer() {

  timer = setInterval(() => {

    timeLeft--;

    // UPDATED: convert seconds to minutes
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // UPDATED: format seconds to always show 2 digits
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    timerElement.textContent = "Time: " + minutes + ":" + formattedSeconds;

    if (timeLeft <= 0) {
      clearInterval(timer);
      showResults();
    }

  }, 1000);

}

//Show results function:
function showResults() {

  clearInterval(timer);

  questionElement.textContent = "Assessment Completed";
  optionsElement.innerHTML = `
  <div style="text-align:center; padding:20px;">

    <div style="font-size:50px; color:green;">✔</div>

    <h2 style="color:#3c3c6c;">Assessment Submitted</h2>

    <p>Thank you for completing the DevTest Hub assessment.</p>

    <p>Your responses have been successfully recorded.</p>

    <p>Your results will be sent to your email shortly.</p>

    <p style="margin-top:15px; font-weight:bold;">
      You may now close this page.
    </p>

  </div>
`;

  if (nextBtn) {
    nextBtn.style.display = "none";
  }

  // GET USER DETAILS
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  // EMAIL DATA
  const templateParams = {
    user_name: name,
    user_email: email,
    quiz_score: score + "/" + questions.length
  };

  // SEND EMAIL
  emailjs.send("service_i6gb6lp", "template_uvfvffg", templateParams)
  .then(function(response) {
      console.log("Email sent successfully", response);
  }, function(error) {
      console.log("Email failed", error);
  });

}