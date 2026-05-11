console.log("Hello DOM! 🚀");

// ==========================
// THEME TOGGLE (Dark/Light Mode)
// ==========================
const themeBtn = document.getElementById("theme-toggle");
const body = document.body;

if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    const isDark = body.classList.toggle("dark-mode");

    themeBtn.textContent = isDark
      ? "Dunkelmodus aus"
      : "Dunkelmodus an";

    themeBtn.setAttribute("aria-pressed", isDark);
  });
}

// ==========================
// TODO APP ELEMENTS
// ==========================
const taskInput = document.getElementById("task-input");
const livePreview = document.getElementById("live-preview");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

// ==========================
// LIVE INPUT PREVIEW
// ==========================
if (taskInput && livePreview) {
  taskInput.addEventListener("input", function (event) {
    const value = event.target.value.trim();

    livePreview.textContent = value
      ? "Vorschau: " + value
      : "Vorschau: —";
  });
}

// ==========================
// CREATE TASK ELEMENT (REUSABLE)
// ==========================
function createTaskElement(text, completed = false) {
  const li = document.createElement("li");
  li.classList.add("task-item");

  const span = document.createElement("span");
  span.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", function () {
    li.remove();
    updateStats();
  });

  // Simple visual state (kept as in original logic)
  if (completed) {
    li.style.backgroundColor = "var(--success-bg)";
    li.style.color = "var(--success)";
  } else {
    li.style.backgroundColor = "var(--error-bg)";
    li.style.color = "var(--error)";
  }

  li.append(span, deleteBtn);
  return li;
}

// ==========================
// ADD TASK FUNCTIONALITY
// ==========================
if (addBtn && taskInput && taskList) {
  addBtn.addEventListener("click", function () {
    const value = taskInput.value.trim();

    if (!value) return;

    taskList.appendChild(createTaskElement(value, false));

    taskInput.value = "";
    livePreview.textContent = "Vorschau: —";
    taskInput.focus();

    updateStats();
  });
}

// ==========================
// ADD TASK WITH ENTER KEY
// ==========================
if (taskInput) {
  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addBtn.click();
    }
  });
}

// ==========================
// FORM VALIDATION & SUBMIT
// ==========================
const feedbackForm = document.getElementById("feedback-form");
const emailInput = document.getElementById("email");
const statusBox = document.getElementById("form-status");

// Live email validation
if (emailInput) {
  emailInput.addEventListener("input", function () {
    if (emailInput.checkValidity()) {
      emailInput.classList.remove("is-invalid");
      emailInput.classList.add("is-valid");
    } else {
      emailInput.classList.remove("is-valid");
      emailInput.classList.add("is-invalid");
    }
  });
}

// Form submit handler
if (feedbackForm && emailInput && statusBox) {
  feedbackForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const userEmail = emailInput.value.trim();

    // Validate properly using built-in method
    if (!emailInput.checkValidity()) {
      statusBox.classList.add("invalid-msg");
      statusBox.textContent = "Please enter a valid email address";
      statusBox.classList.remove("hidden");

      setTimeout(() => statusBox.classList.add("hidden"), 5000);
      return;
    }

    statusBox.textContent = `Thanks, your feedback for ${userEmail} has been received.`;
    statusBox.classList.remove("hidden");

    feedbackForm.reset();
    setTimeout(() => statusBox.classList.add("hidden"), 5000);
  });
}

// ==========================
// API CONFIG
// ==========================
const API_URL = "https://jsonplaceholder.typicode.com/todos";

// ==========================
// FETCH TODOS FROM API
// ==========================
async function fetchTodos() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    renderTodos(data.slice(0, 15));
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// ==========================
// RENDER TODOS
// ==========================
function renderTodos(todos) {
  if (!taskList) return;

  taskList.innerHTML = "";

  todos.forEach(todo => {
    const li = createTaskElement(todo.title, todo.completed);

    taskList.appendChild(li);
  });

  updateStats();
}

// ==========================
// UPDATE STATS
// ==========================
function updateStats() {
  const items = document.querySelectorAll("#task-list li");

  let completed = 0;
  let uncompleted = 0;

  items.forEach(li => {
    if (li.style.color === "var(--success)") {
      completed++;
    } else {
      uncompleted++;
    }
  });

  const stats = document.getElementById("stats");

  if (stats) {
    stats.textContent = `Completed: ${completed}, Uncompleted: ${uncompleted}`;
  }
}

// Initial load
fetchTodos();