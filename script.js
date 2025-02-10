document.addEventListener("DOMContentLoaded", function () {
    // Устанавливаем ширину прогресс-баров по data-progress
    const progressBars = document.querySelectorAll(".progress");
    progressBars.forEach(bar => {
        const progressValue = parseInt(bar.getAttribute("data-progress"), 10);
        bar.style.width = progressValue + "%";
    });

    // Устанавливаем тему согласно localStorage, без изменения текста кнопки
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Функция расчёта суммарного прогресса в контейнере
    function calculateTotalProgress(container) {
        let total = 0;
        const bars = container.querySelectorAll(".progress");
        bars.forEach(bar => {
            total += parseInt(bar.getAttribute("data-progress"), 10) || 0;
        });
        return total;
    }

    // Расчёт прогресса для диссертации (максимум 600, 120 стр.)
    const dissertationContainer = document.getElementById("dissertation-progress").parentElement;
    const dissertationTotal = calculateTotalProgress(dissertationContainer);
    const dissertationPercent = Math.min(Math.round((dissertationTotal / 600) * 100), 100);
    const dissertationPages = Math.round((dissertationTotal / 600) * 120);
    document.getElementById("dissertation-progress").innerText = `Диссертация готова на ${dissertationPercent}%`;
    document.getElementById("page-count").innerText = `${dissertationPages} из 120 стр.`;

    // Расчёт для статьи №1 (максимум 600, 20 стр.)
    const article1Container = document.getElementById("article1-progress").parentElement;
    const article1Total = calculateTotalProgress(article1Container);
    const article1Percent = Math.min(Math.round((article1Total / 600) * 100), 100);
    const article1Pages = Math.round((article1Total / 600) * 20);
    document.getElementById("article1-progress").innerText = `Статья №1 готова на ${article1Percent}%`;
    document.getElementById("article1-page-count").innerText = `${article1Pages} из 20 стр.`;

    // Расчёт для статьи №2 (максимум 600, 20 стр.)
    const article2Container = document.getElementById("article2-progress").parentElement;
    const article2Total = calculateTotalProgress(article2Container);
    const article2Percent = Math.min(Math.round((article2Total / 600) * 100), 100);
    const article2Pages = Math.round((article2Total / 600) * 20);
    document.getElementById("article2-progress").innerText = `Статья №2 готова на ${article2Percent}%`;
    document.getElementById("article2-page-count").innerText = `${article2Pages} из 20 стр.`;
});

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}
