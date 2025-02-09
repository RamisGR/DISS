// Анимация прогресса при загрузке
document.addEventListener("DOMContentLoaded", function () {
    let totalProgress = 0;
    let progressBars = document.querySelectorAll(".progress");

    if (progressBars.length === 0) return; // Защита от пустых элементов

    // Подсчет суммарного прогресса
    progressBars.forEach(bar => {
        let progressValue = parseInt(bar.getAttribute("data-progress"), 10);
        bar.style.width = progressValue + "%";
        totalProgress += progressValue;
    });

    // Новый расчет процентов и страниц (с ограничением до 100%)
    let progressPercent = Math.min(Math.round((totalProgress / 600) * 100), 100);
    let pageCount = Math.round((totalProgress / 600) * 120);

    // Обновление текста итогового прогресса
    let progressElement = document.getElementById("dissertation-progress");
    let pageCountElement = document.getElementById("page-count");

    if (progressElement) {
        progressElement.innerText = `Диссертация готова на ${progressPercent}%`;
    }
    if (pageCountElement) {
        pageCountElement.innerText = `${pageCount} из 120 стр.`;
    }

    // Заполнение шагов (активных точек)
    let steps = document.querySelectorAll(".step");
    let lines = document.querySelectorAll(".line");

    steps.forEach((step, index) => {
        if ((progressPercent / 100) * 6 > index) {
            step.classList.add("active");
        }
    });

    // Заполнение линий между шагами
    lines.forEach((line, index) => {
        let chapterProgress = document.querySelectorAll(".progress")[index].getAttribute("data-progress");
        if (parseInt(chapterProgress, 10) > 0) {
            line.classList.add("filled");
        }
    });
});

// Переключение светлой/тёмной темы
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}
