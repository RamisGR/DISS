// Анимация прогресса при загрузке
document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll(".progress");
    if (progressBars.length === 0) return;

    progressBars.forEach(bar => {
        const progressValue = parseInt(bar.getAttribute("data-progress"), 10);
        bar.style.width = progressValue + "%";
    });

    // Установка темы по сохранённому значению в localStorage
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("theme-toggle").innerText = "Светлая тема";
    } else {
        document.getElementById("theme-toggle").innerText = "Тёмная тема";
    }
});

function toggleTheme() {
    const body = document.body;
    const themeButton = document.getElementById("theme-toggle");

    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        themeButton.innerText = "Светлая тема";
        localStorage.setItem("theme", "dark");
    } else {
        themeButton.innerText = "Тёмная тема";
        localStorage.setItem("theme", "light");
    }
}
