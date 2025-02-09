// Анимация прогресса при загрузке
document.addEventListener("DOMContentLoaded", function () {
    let progressBars = document.querySelectorAll(".progress");

    if (progressBars.length === 0) return;

    progressBars.forEach(bar => {
        let progressValue = parseInt(bar.getAttribute("data-progress"), 10);
        bar.style.width = progressValue + "%";
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("theme-toggle").innerText = "☀";
    }
});

function toggleTheme() {
    let body = document.body;
    let themeButton = document.getElementById("theme-toggle");

    body.classList.toggle("dark-mode");

    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
    themeButton.innerText = body.classList.contains("dark-mode") ? "☀" : "🌙";
}
