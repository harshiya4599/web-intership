const form = document.querySelector("#contact-form");
const nameInput = document.querySelector("#name");
const rollnoInput = document.querySelector("#rollno");
const addressInput = document.querySelector("#address");
const emailInput = document.querySelector("#email");
const courseSelect = document.querySelector("#course");
const formMessage = document.querySelector("#form-message");

const taskInput = document.querySelector("#task-input");
const addTaskButton = document.querySelector("#add-task");
const taskList = document.querySelector("#task-list");

const registrationForm = document.querySelector("#registration-form");
const registrationNameInput = document.querySelector("#reg-name");
const registrationEmailInput = document.querySelector("#reg-email");
const registrationPasswordInput = document.querySelector("#reg-password");
const registrationDepartmentInput = document.querySelector("#reg-department");
const registrationMessage = document.querySelector("#registration-message");

const navButtons = document.querySelectorAll(".nav-btn");
const quickLinkButtons = document.querySelectorAll(".quick-link-btn");
const sectionViews = {
  home: document.querySelector("#home-view"),
  todo: document.querySelector("#todo-view"),
  contact: document.querySelector("#contact-view"),
  registration: document.querySelector("#registration-view"),
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showMessage(message, isError) {
  formMessage.textContent = message;
  formMessage.style.color = isError ? "#d62828" : "#2a9d8f";
}

function showRegistrationMessage(message, isError) {
  registrationMessage.textContent = message;
  registrationMessage.style.color = isError ? "#d62828" : "#2a9d8f";
}

function showView(viewName) {
  Object.entries(sectionViews).forEach(([key, section]) => {
    if (!section) {
      return;
    }
    section.classList.toggle("is-hidden", key !== viewName);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewName);
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showView(button.dataset.view);
  });
});

quickLinkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showView(button.dataset.view);
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameValue = nameInput.value.trim();
    const rollnoValue = rollnoInput.value.trim();
    const addressValue = addressInput.value.trim();
    const emailValue = emailInput.value.trim();
    const courseValue = courseSelect.value.trim();
    const genderValue = form.querySelector("input[name='gender']:checked");

    if (!nameValue || !rollnoValue || !addressValue || !emailValue || !courseValue || !genderValue) {
      showMessage("Please fill out all required fields.", true);
      return;
    }

    if (!emailPattern.test(emailValue)) {
      showMessage("Please enter a valid email address.", true);
      return;
    }

    showMessage("Form submitted successfully!", false);
    form.reset();
  });
}

if (registrationForm) {
  registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const registrationName = registrationNameInput.value.trim();
    const registrationEmail = registrationEmailInput.value.trim();
    const registrationPassword = registrationPasswordInput.value.trim();
    const registrationDepartment = registrationDepartmentInput.value.trim();

    if (!registrationName || !registrationEmail || !registrationPassword || !registrationDepartment) {
      showRegistrationMessage("Please fill out all required fields.", true);
      return;
    }

    if (!emailPattern.test(registrationEmail)) {
      showRegistrationMessage("Please enter a valid email address.", true);
      return;
    }

    if (registrationPassword.length < 6) {
      showRegistrationMessage("Password must be at least 6 characters.", true);
      return;
    }

    showRegistrationMessage("Registration submitted successfully!", false);
    registrationForm.reset();
  });
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (!taskText) {
    return;
  }

  const listItem = document.createElement("li");
  listItem.classList.add("task-item");

  const textSpan = document.createElement("span");
  textSpan.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    listItem.remove();
  });

  listItem.appendChild(textSpan);
  listItem.appendChild(deleteButton);
  taskList.appendChild(listItem);

  taskInput.value = "";
  taskInput.focus();
}

if (addTaskButton) {
  addTaskButton.addEventListener("click", addTask);
}

if (taskInput) {
  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });
}
