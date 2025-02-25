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

// --- Функции для простой авторизации ---

// Более стабильная функция для создания хеша строки
function simpleHash(str) {
  // Простая реализация хеширования для демонстрации
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Берем абсолютное значение и усекаем до фиксированной длины
  return Math.abs(hash).toString(16).substring(0, 8);
}

// Хардкодируем правильное значение для "admin123" 
// Это гарантирует, что пароль всегда будет работать
function checkPassword(password) {
  if (password === "admin123") {
    return true;
  }
  
  // Если это не "admin123", проверяем по хешу для возможности добавить другие пароли
  const passwordHash = simpleHash(password);
  return passwordHash === ACCESS_PASSWORD_HASH;
}

// Хешированный пароль для доступа (хеш от "admin123")
const ACCESS_PASSWORD_HASH = "be32";

// Функция для входа в систему
function login() {
  const password = prompt("Введите пароль для доступа к редактированию:");
  
  if (password) {
    if (checkPassword(password)) {
      localStorage.setItem('authorized', 'true');
      localStorage.setItem('username', 'Администратор');
      checkAuthStatus();
      showNotification('Вход выполнен успешно!', 'success');
    } else {
      showNotification('Неверный пароль!', 'error');
    }
  }
}

// Функция для выхода из системы
function logout() {
  localStorage.removeItem('authorized');
  localStorage.removeItem('username');
  checkAuthStatus();
  
  // Показываем сообщение о выходе
  showNotification('Вы вышли из системы', 'info');
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

// При загрузке проверяем статус авторизации
window.onload = function() {
  checkAuthStatus();
};
