document.addEventListener("DOMContentLoaded", function () {
  // Инициализируем данные из хранилища или используем значения по умолчанию
  initProjectData();
  
  // Рендерим прогресс на основе данных
  renderProjectProgress();
  
  // Инициализация темы согласно localStorage и установка текста кнопки
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").innerText = "Светлая тема";
  } else {
    document.getElementById("theme-toggle").innerText = "Тёмная тема";
  }
  
  // Проверяем статус авторизации и показываем соответствующие элементы
  checkAuthStatus();
});

// Функция для получения цвета прогресса
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

// Функция отрисовки прогресса для всех проектов
function renderProjectProgress() {
  renderProject('dissertation', 'dissertation-progress', 'page-count', 'dissertation-status-text', 'dissertation-progress-change');
  renderProject('article1', 'article1-progress', 'article1-page-count', 'article1-status-text', 'article1-progress-change');
  renderProject('article2', 'article2-progress', 'article2-page-count', 'article2-status-text', 'article2-progress-change');
}

// Функция отрисовки отдельного проекта
function renderProject(projectId, progressElementId, pagesElementId, statusElementId, changeElementId) {
  const project = projectData[projectId];
  const container = document.getElementById(projectId + '-container');
  if (!container) return;
  
  // Очищаем контейнер перед обновлением
  while (container.querySelector('.progress-container')) {
    container.querySelector('.progress-container').remove();
  }
  
  // Рендерим заголовок проекта
  let titleElement = container.querySelector('h1');
  if (!titleElement) {
    titleElement = document.createElement('h1');
    container.prepend(titleElement);
  }
  titleElement.textContent = project.title;
  
  // Добавляем прогресс-бары для каждого раздела
  project.sections.forEach((section, index) => {
    const progressDiv = document.createElement('div');
    progressDiv.className = 'progress-container';
    progressDiv.innerHTML = `
      <div class="progress-label">
        ${section.name} <span class="percent">${section.progress}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress" data-progress="${section.progress}" style="width: ${section.progress}%; background: ${getProgressColor(section.progress)};"></div>
      </div>
    `;
    
    // Добавляем интерактивность для редактирования при клике (только для авторизованных)
    if (isAuthenticated()) {
      progressDiv.querySelector('.progress-label').addEventListener('click', function() {
        const newProgress = prompt(`Новый прогресс для "${section.name}" (0-100):`, section.progress);
        if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
          updateProgress(projectId, index, parseInt(newProgress));
        }
      });
    }
    
    container.insertBefore(progressDiv, container.querySelector('h2'));
  });
  
  // Вычисляем общий прогресс
  let totalProgress = 0;
  project.sections.forEach(section => {
    totalProgress += section.progress;
  });
  const overallPercent = Math.min(Math.round((totalProgress / (project.sections.length * 100)) * 100), 100);
  const pagesCompleted = Math.round((totalProgress / (project.sections.length * 100)) * project.totalPages);
  
  // Обновляем общий прогресс и страницы
  document.getElementById(progressElementId).textContent = `${project.title.split(' ')[1]} готова на ${overallPercent}%`;
  document.getElementById(pagesElementId).textContent = `${pagesCompleted} из ${project.totalPages} стр.`;
  
  // Обновляем текст текущей задачи с анимацией
  const statusElement = document.getElementById(statusElementId);
  statusElement.innerHTML = `Сейчас выполняется: ${project.currentTask} <span class="loading-animation"></span>`;
  
  // Если авторизован, добавляем возможность редактирования текущей задачи
  if (isAuthenticated()) {
    statusElement.addEventListener('click', function() {
      const newTask = prompt('Обновить текущую задачу:', project.currentTask);
      if (newTask !== null) {
        updateCurrentTask(projectId, newTask);
      }
    });
  }
  
  // Добавляем изменение прогресса за 24 часа
  const progressChange = getProgressChange(projectId);
  const changeElement = document.getElementById(changeElementId);
  if (changeElement) {
    const changeValue = progressChange.total.toFixed(1);
    const signClass = changeValue > 0 ? 'positive-change' : (changeValue < 0 ? 'negative-change' : 'no-change');
    const sign = changeValue > 0 ? '+' : '';
    changeElement.innerHTML = `Прогресс за последние 24 часа: <span class="${signClass}">${sign}${changeValue}%</span>`;
  }
}

// Переключение темы
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

// --- Функции для GitHub авторизации ---

// Проверяем статус авторизации
function isAuthenticated() {
  return localStorage.getItem('github_token') !== null;
}

// Проверяем статус авторизации и показываем соответствующие элементы
function checkAuthStatus() {
  const authBtn = document.getElementById('auth-button');
  const logoutBtn = document.getElementById('logout-button');
  const adminControls = document.getElementById('admin-controls');
  
  if (isAuthenticated()) {
    authBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    adminControls.style.display = 'block';
    
    // Получаем информацию о пользователе
    const username = localStorage.getItem('github_username');
    if (username) {
      document.getElementById('user-info').innerHTML = `Привет, ${username}!`;
    }
  } else {
    authBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    adminControls.style.display = 'none';
  }
}

// Функция для инициирования GitHub OAuth
function loginWithGitHub() {
  // Создаем уникальный state для защиты от CSRF
  const state = Math.random().toString(36).substring(2);
  localStorage.setItem('oauth_state', state);
  
  // Замените YOUR_CLIENT_ID на ваш настоящий Client ID
  const clientId = 'YOUR_CLIENT_ID';
  
  // URL для перенаправления после авторизации
  const redirectUri = encodeURIComponent(window.location.href);
  
  // Формируем URL для авторизации
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=read:user`;
  
  // Перенаправляем пользователя на GitHub
  window.location.href = githubUrl;
}

// Функция для выхода из системы
function logout() {
  localStorage.removeItem('github_token');
  localStorage.removeItem('github_username');
  checkAuthStatus();
  
  // Показываем сообщение о выходе
  showNotification('Вы вышли из системы', 'info');
}

// Функция для обработки callback от GitHub
function handleGitHubCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const savedState = localStorage.getItem('oauth_state');
  
  // Удаляем параметры из URL
  const newUrl = window.location.origin + window.location.pathname;
  window.history.pushState({ path: newUrl }, '', newUrl);
  
  if (code && state && state === savedState) {
    // Здесь должен быть запрос к серверной части или сервису для обмена кода на токен
    // Поскольку это GitHub Pages, мы можем использовать сервис-посредник или GitHub Actions
    
    // Примечание: для полноценной реализации вам понадобится серверная часть
    // Здесь упрощенная демонстрация для статического сайта
    
    // Имитация успешной авторизации (для демонстрации)
    simulateSuccessfulAuth();
  }
}

// Для демонстрации - имитируем успешную авторизацию
function simulateSuccessfulAuth() {
  localStorage.setItem('github_token', 'demo_token');
  localStorage.setItem('github_username', 'Пользователь');
  checkAuthStatus();
  
  showNotification('Авторизация успешна!', 'success');
}

// Функция для отображения уведомлений
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Автоматически скрываем через 3 секунды
  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Проверяем, есть ли параметры авторизации в URL при загрузке
window.onload = function() {
  if (window.location.search.includes('code=')) {
    handleGitHubCallback();
  }
};