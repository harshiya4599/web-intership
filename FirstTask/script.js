// Alert Button
const alertBtn = document.getElementById("alertBtn");
alertBtn.addEventListener("click", () => {
  alert("Task 1 completed successfully!");
});

// Info Button
const infoBtn = document.getElementById("infoBtn");
infoBtn.addEventListener("click", () => {
  alert("This project demonstrates clean layout, Light/Dark mode, and basic JavaScript.");
});

// Reset Button
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  location.reload();
});

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});
