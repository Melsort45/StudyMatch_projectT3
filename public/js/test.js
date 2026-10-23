const questionBank = [
  { type: "choice", text: "When you need to remember something important, what do you naturally do first?", answers: [["activeRecall", "Quiz myself or explain it without looking at my notes."], ["spacedRepetition", "Review it several times over different days."], ["conceptMapping", "Draw connections between it and ideas I already know."], ["pomodoro", "Set aside a focused block of time to work on it."]] },
  { type: "choice", text: "What usually makes a study session feel successful?", answers: [["pomodoro", "I stayed focused and made steady progress."], ["activeRecall", "I can answer questions about what I learned."], ["conceptMapping", "I can see how the big ideas fit together."], ["spacedRepetition", "I remembered something I studied earlier."]] },
  { type: "choice", text: "How do you prefer to organize a complicated topic?", answers: [["conceptMapping", "With diagrams, colors, arrows, or a visual outline."], ["activeRecall", "With questions that break the topic into smaller pieces."], ["spacedRepetition", "With a review schedule and short topic lists."], ["pomodoro", "With a series of small tasks I can complete one at a time."]] },
  { type: "choice", text: "What is your biggest challenge when studying?", answers: [["pomodoro", "Getting started or staying focused for long periods."], ["spacedRepetition", "Remembering material after the test is over."], ["activeRecall", "Knowing whether I truly understand a chapter."], ["conceptMapping", "Making sense of lots of connected information."]] },
  { type: "choice", text: "Which activity would you choose before an important exam?", answers: [["activeRecall", "Answer practice questions without looking at the notes."], ["spacedRepetition", "Review flashcards from earlier study sessions."], ["conceptMapping", "Create one visual summary of the subject."], ["pomodoro", "Plan several focused study blocks."]] },
  { type: "choice", text: "When your attention starts to fade, what helps you most?", answers: [["pomodoro", "Take a planned short break before starting again."], ["activeRecall", "Switch to practice questions."], ["conceptMapping", "Draw or reorganize the main ideas."], ["spacedRepetition", "Review a smaller set of familiar material."]] },
  { type: "choice", text: "What do you usually do after finishing a chapter?", answers: [["activeRecall", "Close the notes and recall the main points."], ["spacedRepetition", "Schedule another review for later."], ["conceptMapping", "Add the ideas to a larger diagram."], ["pomodoro", "Mark the task complete and plan the next block."]] },
  { type: "choice", text: "Which study routine would be easiest for you to maintain?", answers: [["spacedRepetition", "Short reviews repeated throughout the week."], ["pomodoro", "Several timed sessions with planned breaks."], ["activeRecall", "Regular practice quizzes."], ["conceptMapping", "A visual set of notes that grows over time."]] },
  { type: "order", text: "Rank these study habits from most like you to least like you.", answers: [["activeRecall", "Testing myself with questions"], ["spacedRepetition", "Reviewing material over time"], ["conceptMapping", "Connecting ideas visually"], ["pomodoro", "Working in timed focus blocks"]] },
  { type: "order", text: "Put these study goals in your preferred order.", answers: [["pomodoro", "Stay focused"], ["activeRecall", "Remember information"], ["conceptMapping", "Understand the big picture"], ["spacedRepetition", "Keep knowledge for longer"]] },
  { type: "order", text: "Rank the study tools you would be most likely to use.", answers: [["conceptMapping", "A diagram or mind map"], ["activeRecall", "Flashcards or practice questions"], ["pomodoro", "A timer and task list"], ["spacedRepetition", "A review calendar"]] },
  { type: "scale", method: "activeRecall", text: "I learn effectively when I test myself instead of rereading my notes." },
  { type: "scale", method: "spacedRepetition", text: "I remember information better when I review it over several days." },
  { type: "scale", method: "conceptMapping", text: "I understand difficult topics better when I connect ideas visually." },
  { type: "scale", method: "pomodoro", text: "I study more effectively when I work in focused time blocks." }
];

const methods = {
  activeRecall: { name: "Active Recall", icon: "bi-lightning-charge-fill", description: "You learn strongest when you retrieve information instead of only rereading it. Build your sessions around practice questions, flashcards, and teaching concepts aloud." },
  spacedRepetition: { name: "Spaced Repetition", icon: "bi-calendar-range", description: "Your memory benefits from well-timed reviews. Return to material across several days, increasing the gaps as it becomes more familiar." },
  conceptMapping: { name: "Concept Mapping", icon: "bi-diagram-3", description: "You make sense of complexity by seeing relationships. Use diagrams, connected notes, and visual summaries to turn separate facts into a clear system." },
  pomodoro: { name: "Pomodoro Technique", icon: "bi-clock-history", description: "You thrive with clear boundaries and focused momentum. Work in timed sprints, pause deliberately, and use each cycle to complete one defined task." }
};

const storageKey = "studyMatchAttempts";
const questions = [...questionBank];
for (let index = questions.length - 1; index > 0; index -= 1) {
  const randomIndex = Math.floor(Math.random() * (index + 1));
  [questions[index], questions[randomIndex]] = [questions[randomIndex], questions[index]];
}

const questionTitle = document.getElementById("questionTitle");
const answerOptions = document.getElementById("answerOptions");
const questionCounter = document.getElementById("questionCounter");
const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const validationMessage = document.getElementById("validationMessage");
const quizPanel = document.getElementById("quizPanel");
const resultPanel = document.getElementById("resultPanel");
const agreementRange = document.getElementById("agreementRange");
const agreementValue = document.getElementById("agreementValue");
const agreementControl = document.getElementById("agreementControl");
const questionHelp = document.getElementById("questionHelp");
const saveMessage = document.getElementById("saveMessage");

let currentQuestion = 0;
let answers = createEmptyAnswers();
let draggedValue = null;

function createEmptyAnswers() {
  return questions.map((question) => {
    if (question.type === "choice") return { choice: null };
    if (question.type === "order") return { order: question.answers.map(([value]) => value) };
    return { agreement: 50 };
  });
}

function renderQuestion() {
  const question = questions[currentQuestion];
  const response = answers[currentQuestion];
  const percent = Math.round(((currentQuestion + 1) / questions.length) * 100);

  questionTitle.textContent = question.text;
  questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  progressBar.parentElement.setAttribute("aria-valuenow", String(percent));
  backButton.disabled = currentQuestion === 0;
  nextButton.textContent = currentQuestion === questions.length - 1 ? "See my result" : "Next";
  validationMessage.hidden = true;
  agreementControl.hidden = question.type !== "scale";

  if (question.type === "choice") {
    questionHelp.textContent = "Choose the option that best matches your habits.";
    answerOptions.innerHTML = question.answers.map(([value, label], index) => `
      <label class="answer-option ${response.choice === value ? "selected" : ""}">
        <input type="radio" name="answer" value="${value}" ${response.choice === value ? "checked" : ""}>
        <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
        <span class="answer-label">${label}</span>
      </label>`).join("");
    answerOptions.querySelectorAll('input[name="answer"]').forEach((input) => {
      input.addEventListener("change", () => {
        response.choice = input.value;
        answerOptions.querySelectorAll(".answer-option").forEach((option) => {
          option.classList.toggle("selected", option.contains(input));
        });
      });
    });
    return;
  }

  if (question.type === "order") {
    questionHelp.textContent = "Move the options into the order that best matches your habits.";
    answerOptions.innerHTML = response.order.map((value, index) => {
      const label = question.answers.find(([optionValue]) => optionValue === value)[1];
      return `<div class="answer-option order-option" draggable="true" data-value="${value}">
        <span class="answer-letter">${index + 1}</span>
        <span class="answer-label">${label}</span>
        <span class="move-buttons">
          <button type="button" class="move-option" data-direction="up" aria-label="Move ${label} up" ${index === 0 ? "disabled" : ""}><i class="bi bi-chevron-up"></i></button>
          <button type="button" class="move-option" data-direction="down" aria-label="Move ${label} down" ${index === response.order.length - 1 ? "disabled" : ""}><i class="bi bi-chevron-down"></i></button>
        </span>
      </div>`;
    }).join("");

    answerOptions.querySelectorAll(".move-option").forEach((button) => {
      button.addEventListener("click", () => moveOption(button.closest(".answer-option").dataset.value, button.dataset.direction));
    });
    answerOptions.querySelectorAll(".order-option").forEach((option) => {
      option.addEventListener("dragstart", () => {
        draggedValue = option.dataset.value;
        option.classList.add("dragging");
      });
      option.addEventListener("dragend", () => {
        option.classList.remove("dragging");
        draggedValue = null;
      });
      option.addEventListener("dragover", (event) => event.preventDefault());
      option.addEventListener("drop", (event) => {
        event.preventDefault();
        if (draggedValue && draggedValue !== option.dataset.value) {
          moveDraggedOption(draggedValue, option.dataset.value);
        }
      });
    });
    return;
  }

  questionHelp.textContent = "Choose the percentage that matches this habit.";
  answerOptions.innerHTML = `<div class="scale-method"><i class="bi ${methods[question.method].icon}"></i><span>${methods[question.method].name}</span></div>`;
  agreementRange.value = String(response.agreement);
  agreementValue.value = `${response.agreement}%`;
}

function moveOption(value, direction) {
  const order = answers[currentQuestion].order;
  const index = order.indexOf(value);
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= order.length) return;
  [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
  renderQuestion();
}

function moveDraggedOption(value, targetValue) {
  const order = answers[currentQuestion].order;
  const sourceIndex = order.indexOf(value);
  const targetIndex = order.indexOf(targetValue);
  if (sourceIndex < 0 || targetIndex < 0) return;
  order.splice(sourceIndex, 1);
  order.splice(targetIndex, 0, value);
  renderQuestion();
}

function saveAttempt(scores, winner) {
  const storedAttempts = localStorage.getItem(storageKey);
  const attempts = storedAttempts ? JSON.parse(storedAttempts) : [];
  if (!Array.isArray(attempts)) {
    throw new Error("Saved StudyMatch attempts are not in the expected format.");
  }

  const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : String(Date.now());
  attempts.push({
    id,
    createdAt: new Date().toISOString(),
    answers: answers.map((answer) => answer.order ? { order: [...answer.order] } : { ...answer }),
    scores,
    recommendation: winner
  });
  localStorage.setItem(storageKey, JSON.stringify(attempts.slice(-10)));
}

function showResult() {
  const scores = answers.reduce((totals, response, index) => {
    const question = questions[index];
    if (question.type === "choice") totals[response.choice] += 1;
    else if (question.type === "order") {
      response.order.forEach((method, rank) => { totals[method] += response.order.length - rank; });
    } else {
      totals[question.method] += response.agreement / 25;
    }
    return totals;
  }, { activeRecall: 0, spacedRepetition: 0, conceptMapping: 0, pomodoro: 0 });

  const winner = Object.keys(scores).sort((first, second) => scores[second] - scores[first])[0];
  const method = methods[winner];
  const maximumScore = questions.reduce((total, question) => total + (question.type === "choice" ? 1 : 4), 0);
  const score = Math.round((scores[winner] / maximumScore) * 100);

  document.getElementById("resultTitle").textContent = method.name;
  document.getElementById("resultDescription").textContent = method.description;
  document.getElementById("resultScore").textContent = `${score}% match`;
  document.getElementById("scoreBar").style.width = `${score}%`;
  document.getElementById("scoreBar").parentElement.setAttribute("aria-valuenow", String(score));
  document.getElementById("resultBreakdown").innerHTML = Object.entries(scores)
    .sort(([, first], [, second]) => second - first)
    .map(([key, value]) => `<div class="breakdown-row"><span><i class="bi ${methods[key].icon} me-2"></i>${methods[key].name}</span><strong>${value.toFixed(1)} points</strong></div>`)
    .join("");

  try {
    saveAttempt(scores, winner);
    saveMessage.textContent = "Your result has been saved in this browser.";
  } catch (error) {
    console.error("Could not save the StudyMatch quiz attempt.", error);
    saveMessage.textContent = "Your result is ready, but this attempt could not be saved in this browser.";
  }

  quizPanel.hidden = true;
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

nextButton.addEventListener("click", () => {
  if (questions[currentQuestion].type === "choice" && !answers[currentQuestion].choice) {
    validationMessage.hidden = false;
    return;
  }
  if (currentQuestion === questions.length - 1) {
    showResult();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
});

backButton.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    renderQuestion();
  }
});

agreementRange.addEventListener("input", () => {
  answers[currentQuestion].agreement = Number(agreementRange.value);
  agreementValue.value = `${agreementRange.value}%`;
});

document.getElementById("retakeButton").addEventListener("click", () => {
  currentQuestion = 0;
  answers = createEmptyAnswers();
  resultPanel.hidden = true;
  quizPanel.hidden = false;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderQuestion();
