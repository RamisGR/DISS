// Анимация прогресса при загрузке
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".progress").forEach(bar => {
        let progressValue = bar.getAttribute("data-progress");
        bar.style.width = progressValue + "%";
    });
});

// Функция обновления прогресса
function updateProgress() {
    document.querySelectorAll(".progress").forEach(bar => {
        let newValue = Math.floor(Math.random() * 100) + 1;
        bar.style.width = newValue + "%";
        bar.parentElement.previousElementSibling.querySelector(".percent").innerText = newValue + "%";
    });
}

// Переключение светлой/тёмной темы
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}
