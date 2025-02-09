// Анимация прогресса при загрузке
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".progress").forEach(bar => {
        let progressValue = bar.getAttribute("data-progress");
        bar.style.width = progressValue + "%";
    });
});

// Переключение светлой/тёмной темы
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}
