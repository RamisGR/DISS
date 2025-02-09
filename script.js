document.addEventListener("DOMContentLoaded", function () {
    // Анимация прогресса: установка ширины для каждого элемента .progress
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

    // Функция расчёта суммарного прогресса в заданном контейнере
    function calculateTotalProgress(container) {
        let total = 0;
        const bars = container.querySelectorAll(".progress");
        bars.forEach(bar => {
            total += parseInt(bar.getAttribute("data-progress"), 10) || 0;
        });
        return total;
    }

    // Расчёт для диссертации (максимум: 600, страниц – 120)
    const dissertationContainer = document.getElementById("dissertation-progress").parentElement;
    const dissertationTotal = calculateTotalProgress(dissertationContainer);
    const dissertationPercent = Math.min(Math.round((dissertationTotal / 600) * 100), 100);
    const dissertationPages = Math.round((dissertationTotal / 600) * 120);
    document.getElementById("dissertation-progress").innerText = `Диссертация готова на ${dissertationPercent}%`;
    document.getElementById("page-count").innerText = `${dissertationPages} из 120 стр.`;

    // Расчёт для статьи №1 (максимум: 600, страниц – 20)
    const article1Container = document.getElementById("article1-progress").parentElement;
    const article1Total = calculateTotalProgress(article1Container);
    const article1Percent = Math.min(Math.round((article1Total / 600) * 100), 100);
    const article1Pages = Math.round((article1Total / 600) * 20);
    document.getElementById("article1-progress").innerText = `Статья №1 готова на ${article1Percent}%`;
    document.getElementById("article1-page-count").innerText = `${article1Pages} из 20 стр.`;

    // Расчёт для статьи №2 (максимум: 600, страниц – 20)
    const article2Container = document.getElementById("article2-progress").parentElement;
    const article2Total = calculateTotalProgress(article2Container);
    const article2Percent = Math.min(Math.round((article2Total / 600) * 100), 100);
    const article2Pages = Math.round((article2Total / 600) * 20);
    document.getElementById("article2-progress").innerText = `Статья №2 готова на ${article2Percent}%`;
    document.getElementById("article2-page-count").innerText = `${article2Pages} из 20 стр.`;
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
