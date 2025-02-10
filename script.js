document.addEventListener("DOMContentLoaded", function () {
  // Функция для интерполяции цвета по проценту с контрольными точками:
  // 0–10%: красный; 10–40%: градиент от красного к оранжевому;
  // 40–70%: градиент от оранжевого к жёлтому; 70–100%: градиент от жёлтого к зелёному.
  function getProgressColor(percent) {
    if (percent <= 10) {
      return "rgb(255, 0, 0)"; // красный
    } else if (percent <= 40) {
      const t = (percent - 10) / 30; // 10-40 -> 0-1
      const r = 255;
      const g = Math.round(0 + t * (165 - 0));
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    } else if (percent <= 70) {
      const t = (percent - 40) / 30; // 40-70 -> 0-1
      const r = 255;
      const g = Math.round(165 + t * (255 - 165));
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = (percent - 70) / 30; // 70-100 -> 0-1
      const r = Math.round(255 - t * 255);
      const g = 255;
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // Устанавливаем ширину и динамический цвет для каждого элемента .progress
  const progressBars = document.querySelectorAll(".progress");
  progressBars.forEach(bar => {
    const progressValue = parseInt(bar.getAttribute("data-progress"), 10);
    bar.style.width = progressValue + "%";
    bar.style.background = getProgressColor(progressValue);
  });

  // Инициализация темы согласно localStorage и установка текста кнопки
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").innerText = "Светлая тема";
  } else {
    document.getElementById("theme-toggle").innerText = "Тёмная тема";
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

  // Расчёт для диссертации (максимум 600, 120 стр.)
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
  if (document.body.classList.contains("dark-mode")) {
    document.getElementById("theme-toggle").innerText = "Светлая тема";
    localStorage.setItem("theme", "dark");
  } else {
    document.getElementById("theme-toggle").innerText = "Тёмная тема";
    localStorage.setItem("theme", "light");
  }
}
