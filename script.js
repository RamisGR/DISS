// Анимация прогресса при загрузке
document.addEventListener("DOMContentLoaded", function () {
    let totalProgress = 0;

    document.querySelectorAll(".progress").forEach(bar => {
        let progressValue = parseInt(bar.getAttribute("data-progress"));
        bar.style.width = progressValue + "%";
        totalProgress += progressValue;
    });

    let progressPercent = Math.round(totalProgress / 6);
    let pageCount = Math.round((totalProgress / 100) * 120);

    document.getElementById("dissertation-progress").innerText = `Диссертация готова на ${progressPercent}%`;
    document.getElementById("page-count").innerText = `${pageCount} из 120 стр.`;

    // Заполнение шагов
    let steps = document.querySelectorAll(".step");
    let lines = document.querySelectorAll(".line");

    steps.forEach((step, index) => {
        if ((progressPercent / 100) * 6 > index) {
            step.classList.add("active");
        }
    });

    lines.forEach((line, index) => {
        let chapterProgress = document.querySelectorAll(".progress")[index].getAttribute("data-progress");
        if (parseInt(chapterProgress) > 0) {
            line.classList.add("filled");
        }
    });
});

// Переключение светлой/тёмной темы
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}
