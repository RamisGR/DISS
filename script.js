// Основная инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
  console.log("Страница загружена");
  
  // Инициализируем данные из хранилища или используем значения по умолчанию
  initProjectData();
  
  // Рендерим прогресс на основе данных
  renderProjectProgress();
  
  // Инициализация темы согласно localStorage
  initTheme();
  
  // Проверяем статус авторизации и показываем соответствующие элементы
  checkAuthStatus();
  
  // Добавляем обработчики событий для кнопок
  document.getElementById("auth-button").addEventListener("click", login);
  document.getElementById("logout-button").addEventListener("click", logout);
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
});

// Инициализация темы
function initTheme() {
  try {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      document.getElementById("theme-toggle").innerText = "Светлая тема";
    } else {
      document.getElementById("theme-toggle").innerText = "Тёмная тема";
    }
  } catch (error) {
    console.error("Ошибка при инициализации темы:", error);
  }
}

// Функция для получения цвета прогресса
function getProgressColor(percent) {
  try {
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
  } catch (error) {
    console.error("Ошибка при расчете цвета прогресса:", error);
    return "rgb(128, 128, 128)"; // серый в случае ошибки
  }
}

// Функция отрисовки прогресса для всех проектов
function renderProjectProgress() {
  try {
    renderProject('dissertation', 'dissertation-progress', 'page-count', 'dissertation-status-text', 'dissertation-progress-change');
    renderProject('article1', 'article1-progress', 'article1-page-count', 'article1-status-text', 'article1-progress-change');
    renderProject('article2', 'article2-progress', 'article2-page-count', 'article2-status-text', 'article2-progress-change');
  } catch (error) {
    console.error("Ошибка при отрисовке прогресса проектов:", error);
  }
}

// Функция отрисовки отдельного проекта
function renderProject(projectId, progressElementId, pagesElementId, statusElementId, changeElementId) {
  try {
    const project = projectData[projectId];
    const container = document.getElementById(projectId + '-container');
    if (!container || !project) {
      console.error(`Не найден контейнер или данные для проекта: ${projectId}`);
      return;
    }
    
    // Создаем или обновляем заголовок проекта
    let titleElement = container.querySelector('h1');
    if (!titleElement) {
      titleElement = document.createElement('h1');
      container.prepend(titleElement);
    }
    titleElement.textContent = project.title;
    
    // Удаляем существующие контейнеры прогресса
    const progressContainers = container.querySelectorAll('.progress-container');
    progressContainers.forEach(element => element.remove());
    
    // Добавляем прогресс-бары для каждого раздела
    project.sections.forEach((section, index) => {
      if (!section || typeof section.progress !== 'number') {
        console.warn(`Некорректные данные секции для ${projectId}[${index}]`);
        return;
      }
      
      const progressDiv = document.createElement('div');
      progressDiv.className = 'progress-container';
      
      const progressLabelDiv = document.createElement('div');
      progressLabelDiv.className = 'progress-label';
      
      const nameSpan = document.createTextNode(section.name + ' ');
      const percentSpan = document.createElement('span');
      percentSpan.className = 'percent';
      percentSpan.textContent = `${section.progress}%`;
      
      progressLabelDiv.appendChild(nameSpan);
      progressLabelDiv.appendChild(percentSpan);
      
      const progressBarDiv = document.createElement('div');
      progressBarDiv.className = 'progress-bar';
      
      const progressInnerDiv = document.createElement('div');
      progressInnerDiv.className = 'progress';
      progressInnerDiv.dataset.progress = section.progress;
      progressInnerDiv.style.width = `${section.progress}%`;
      progressInnerDiv.style.background = getProgressColor(section.progress);
      
      progressBarDiv.appendChild(progressInnerDiv);
      progressDiv.appendChild(progressLabelDiv);
      progressDiv.appendChild(progressBarDiv);
      
      // Добавляем интерактивность для редактирования при клике (только для авторизованных)
      if (isAuthenticated()) {
        progressLabelDiv.addEventListener('click', function() {
          const newProgress = prompt(`Новый прогресс для "${section.name}" (0-100):`, section.progress);
          const parsedProgress = parseInt(newProgress);
          if (newProgress !== null && !isNaN(parsedProgress) && parsedProgress >= 0 && parsedProgress <= 100) {
            updateProgress(projectId, index, parsedProgress);
          }
        });
      }
      
      // Вставляем перед h2
      const h2Element = container.querySelector('h2');
      if (h2Element) {
        container.insertBefore(progressDiv, h2Element);
      } else {
        container.appendChild(progressDiv);
      }
    });
    
    // Вычисляем общий прогресс
    let totalProgress = 0;
    let validSections = 0;
    
    project.sections.forEach(section => {
      if (section && typeof section.progress === 'number') {
        totalProgress += section.progress;
        validSections++;
      }
    });
    
    const overallPercent = validSections > 0 
      ? Math.min(Math.round((totalProgress / (validSections * 100)) * 100), 100)
      : 0;
      
    const pagesCompleted = validSections > 0
      ? Math.round((totalProgress / (validSections * 100)) * project.totalPages)
      : 0;
    
    // Обновляем общий прогресс и страницы
    const progressElement = document.getElementById(progressElementId);
    if (progressElement) {
      const titleParts = project.title.split(' ');
      progressElement.textContent = `${titleParts[1]} готова на ${overallPercent}%`;
    }
    
    const pagesElement = document.getElementById(pagesElementId);
    if (pagesElement) {
      pagesElement.textContent = `${pagesCompleted} из ${project.totalPages} стр.`;
    }
    
    // Обновляем текст текущей задачи
    const statusElement = document.getElementById(statusElementId);
    if (statusElement) {
      // Безопасное удаление слушателей событий путем замены элемента
      const newStatusElement = statusElement.cloneNode(false);
      newStatusElement.innerHTML = `Сейчас выполняется: ${project.currentTask} <span class="loading-animation"></span>`;
      
      // Если пользователь авторизован, добавляем возможность редактирования
      if (isAuthenticated()) {
        newStatusElement.addEventListener('click', function() {
          const newTask = prompt('Обновить текущую задачу:', project.currentTask);
          if (newTask !== null) {
            updateCurrentTask(projectId, newTask);
          }
        });
      }
      
      statusElement.parentNode.replaceChild(newStatusElement, statusElement);
    }
    
    // Добавляем изменение прогресса за 24 часа
    const progressChange = getProgressChange(projectId);
    const changeElement = document.getElementById(changeElementId);
    if (changeElement) {
      const changeValue = parseFloat(progressChange.total).toFixed(1);
      const signClass = changeValue > 0 ? 'positive-change' : (changeValue < 0 ? 'negative-change' : 'no-change');
      const sign = changeValue > 0 ? '+' : '';
      changeElement.innerHTML = `Прогресс за последние 24 часа: <span class="${signClass}">${sign}${changeValue}%</span>`;
    }
  } catch (error) {
    console.error(`Ошибка при отрисовке проекта ${projectId}:`, error);
  }
}

// Переключение темы
function toggleTheme() {
  try {
    document.body.classList.toggle("dark-mode");
    const themeToggle = document.getElementById("theme-toggle");
    
    if (document.body.classList.contains("dark-mode")) {
      themeToggle.innerText = "Светлая тема";
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.innerText = "Тёмная тема";
      localStorage.setItem("theme", "light");
    }
  } catch (error) {
    console.error("Ошибка при переключении темы:", error);
  }
}

// --- СИСТЕМА АВТОРИЗАЦИИ ---
function isAuthenticated() {
  try {
    return localStorage.getItem('authorized') === 'true';
  } catch (error) {
    console.error("Ошибка при проверке авторизации:", error);
    return false;
  }
}

function checkAuthStatus() {
  try {
    console.log("Проверка статуса авторизации");
    
    const authBtn = document.getElementById('auth-button');
    const logoutBtn = document.getElementById('logout-button');
    const adminControls = document.getElementById('admin-controls');
    const userInfo = document.getElementById('user-info');
    
    if (!authBtn || !logoutBtn || !adminControls || !userInfo) {
      console.error("Не удалось найти элементы интерфейса для авторизации");
      return;
    }
    
    if (isAuthenticated()) {
      console.log("Пользователь авторизован");
      authBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      adminControls.style.display = 'block';
      
      const username = localStorage.getItem('username') || 'Администратор';
      userInfo.innerHTML = `Привет, ${username}!`;
    } else {
      console.log("Пользователь не авторизован");
      authBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
      adminControls.style.display = 'none';
      userInfo.innerHTML = '';
    }
  } catch (error) {
    console.error("Ошибка при проверке статуса авторизации:", error);
  }
}

function login() {
  try {
    console.log("Попытка входа");
    const password = prompt("Введите пароль для доступа к редактированию:");
    
    // Если пользователь нажал "Отмена"
    if (password === null) return;
    
    // Массив допустимых паролей
    const validPasswords = ['admin123', '123'];
    
    // Проверка пароля
    if (validPasswords.includes(password)) {
      console.log("Пароль верный");
      localStorage.setItem('authorized', 'true');
      localStorage.setItem('username', 'Администратор');
      checkAuthStatus();
      renderProjectProgress(); // Перерисовываем проекты с интерактивностью
      showNotification('Вход выполнен успешно!', 'success');
    } else {
      console.log("Пароль неверный:", password);
      showNotification('Неверный пароль!', 'error');
    }
  } catch (error) {
    console.error("Ошибка при входе:", error);
    showNotification('Произошла ошибка при входе', 'error');
  }
}

function logout() {
  try {
    console.log("Выход из системы");
    localStorage.removeItem('authorized');
    localStorage.removeItem('username');
    checkAuthStatus();
    renderProjectProgress(); // Перерисовываем проекты без интерактивности
    
    showNotification('Вы вышли из системы', 'info');
  } catch (error) {
    console.error("Ошибка при выходе:", error);
    showNotification('Произошла ошибка при выходе', 'error');
  }
}

// Функция для отображения уведомлений
function showNotification(message, type = 'info') {
  try {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(note => {
      note.classList.add('hide');
      setTimeout(() => note.remove(), 500);
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  } catch (error) {
    console.error("Ошибка при отображении уведомления:", error);
  }
}
