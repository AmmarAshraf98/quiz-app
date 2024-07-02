//https://opentdb.com/api.php?amount=5&category=9&difficulty=easy

// select form
const form = document.querySelector("#quizOptions");

// select form element
const category = document.querySelector("#categoryMenu");
const level = document.querySelector("#difficultyOptions");
const questionNum = document.querySelector("#questionsNumber");
const Btn = document.querySelector("#startQuiz");

// select question display
const rowData = document.querySelector("#rowData");

// global variables
let questions;
let myQuiz;

// get data
const getData = async () => {
  const value = {
    category: category.value,
    level: level.value,
    questionNum: questionNum.value,
  };

  //   create object
  myQuiz = new Quiz(value);
  //   prepare url
  myQuiz.prepareUrl();
  //   call api
  questions = await myQuiz.getQuiestion();
  console.log(questions);

  // create object from createQuestion class
  let currentQuestion = new CreateQuestion(0);
  console.log(currentQuestion);
  // call display method
  currentQuestion.display();

  //   hide form
  form.classList.add("d-none");
};

// create quiz
class Quiz {
  constructor({ category, level, questionNum }) {
    this.category = category;
    this.level = level;
    this.questionNum = questionNum;
    this.score = 0;
    this.isAnswerd = false;
  }

  //   prepare url
  prepareUrl() {
    return `https://opentdb.com/api.php?amount=${this.questionNum}&category=${this.category}&difficulty=${this.level}`;
  }

  //   call Api function
  async getQuiestion() {
    const response = await fetch(this.prepareUrl());
    const data = await response.json();
    return data.results;
  }

  // check if all question kosom7a
  showResul() {
    rowData.innerHTML = `
    <div
            class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
        <h2 class="mb-0 text-center">
            ${
              this.score == this.questionNum
                ? `Congratulations! 🎉`
                : `Better luck next time, You answered ${this.score} out of ${this.questionNum} questions!`
            }
        </h2>
            <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
        </div>
    `;
    const again = document.querySelector(".again");
    again.addEventListener("click", () => {
      location.reload();
    });
  }
}

class CreateQuestion {
  constructor(index) {
    this.index = index;
    this.category = questions[index].category;
    this.question = questions[index].question;
    this.correct_answer = questions[index].correct_answer;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.allAnswers = [this.correct_answer, ...this.incorrect_answers].sort();
    this.difficulty = questions[index].difficulty;
  }

  display() {
    let cartona = `
    <div
         class="question shadow-lg col-md-8 offset-md-2  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
         <div class="w-100 d-flex justify-content-between">
         <span class="btn btn-category">${this.category}</span>
         <span class="fs-6 btn btn-questions"> ${this.index + 1} of ${
      questions.length
    } Questions</span>
         </div>
         <h2 class="text-capitalize h4 text-center">${this.question}</h2>
         <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
          ${this.allAnswers
            .map((e) => `<li>${e}</li>`)
            .join("")
            .replace(",", "")}
         </ul>
         <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${
           myQuiz.score
         }</h2>
         </div>
   `;

    rowData.innerHTML = cartona;

    // select li to add event
    const allAnswers = document.querySelectorAll("ul li");
    allAnswers.forEach((ele) => {
      ele.addEventListener("click", () => {
        this.checkAnswer(ele);
      });
    });
  }

  checkAnswer(choice) {
    if (!this.isAnswerd) {
      this.isAnswerd = true;
      if (choice.innerHTML === this.correct_answer) {
        myQuiz.score++;
        console.log("done");
        choice.classList.add("correct", "animate__animated", "animate__pulse");
      } else {
        choice.classList.add("wrong", "animate__animated", "animate__shakeX");
        console.log("bom");
      }
      // create next question
      this.getNextQ();
    }
  }

  getNextQ() {
    this.index++;
    if (questions.length > this.index) {
      let currentQuestion = new CreateQuestion(this.index);
      setTimeout(() => {
        currentQuestion.display();
      }, 1000);
    } else {
      myQuiz.showResul();
    }
  }
}

Btn.addEventListener("click", getData);
