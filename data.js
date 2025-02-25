// data.js - Централизованное хранение данных о прогрессе
const projectData = {
  // Данные о прогрессе диссертации
  dissertation: {
    title: "Прогресс диссертации",
    sections: [
      { name: "Введение", progress: 90 },
      { name: "Глава 1. Анализ состояния вопроса", progress: 60 },
      { name: "Глава 2. Теоретическое исследование", progress: 20 },
      { name: "Глава 3. Моделирование в Ansys", progress: 30 },
      { name: "Глава 4. Практическое применение результатов", progress: 30 },
      { name: "Глава 5. Выбор конфигурации устройства", progress: 15 }
    ],
    totalPages: 120,
    currentTask: "Глава 3 – изучение задания валидной расчётной модели",
    lastUpdate: new Date().toISOString() // Текущая дата как исходная
  },
  
  // Данные о прогрессе статьи 1
  article1: {
    title: "Прогресс статьи №1",
    sections: [
      { name: "Аннотация", progress: 90 },
      { name: "Введение", progress: 90 },
      { name: "Методы и материалы", progress: 20 },
      { name: "Результаты", progress: 5 },
      { name: "Обсуждение и заключение", progress: 40 },
      { name: "Библиографический список", progress: 60 }
    ],
    totalPages: 20,
    currentTask: "Методы и материалы - разработка расчётной модели в ansys",
    lastUpdate: new Date().toISOString()
  },
  
  // Данные о прогрессе статьи 2
  article2: {
    title: "Прогресс статьи №2",
    sections: [
      { name: "Аннотация", progress: 5 },
      { name: "Введение", progress: 5 },
      { name: "Методы и материалы", progress: 10 },
      { name: "Результаты", progress: 1 },
      { name: "Обсуждение и заключение", progress: 30 },
      { name: "Библиографический список", progress: 20 }
    ],
    totalPages: 20,
    currentTask: "Изучение литературы",
    lastUpdate: new Date().toISOString()
  }
};

// Функция для сохранения данных в localStorage
function saveProjectData() {
  // Сохраняем текущее состояние
  localStorage.setItem('projectData', JSON.stringify(projectData));
  
  // Сохраняем историю изменений
  let history = JSON.parse(localStorage.getItem('progressHistory') || '[]');
  
  // Добавляем текущее состояние в историю с временной меткой
  const currentSnapshot = {
    timestamp: new Date().toISOString(),
    dissertation: JSON.parse(JSON.stringify(projectData.dissertation)),
    article1: JSON.parse(JSON.stringify(projectData.article1)),
    article2: JSON.parse(JSON.stringify(projectData.article2))
  };
  
  // Ограничиваем историю до 30 дней
  if (history.length > 30) {
    history.shift(); // Удаляем самую старую запись
  }
  
  history.push(currentSnapshot);
  localStorage.setItem('progressHistory', JSON.stringify(history));
}

// Функция для обновления прогресса
function updateProgress(projectId, sectionIndex, newProgress) {
  if (projectData[projectId] && projectData[projectId].sections[sectionIndex]) {
    projectData[projectId].sections[sectionIndex].progress = newProgress;
    projectData[projectId].lastUpdate = new Date().toISOString();
    saveProjectData();
    renderProjectProgress(); // Перерисовываем прогресс
  }
}

// Функция для обновления текущей задачи
function updateCurrentTask(projectId, newTask) {
  if (projectData[projectId]) {
    projectData[projectId].currentTask = newTask;
    projectData[projectId].lastUpdate = new Date().toISOString();
    saveProjectData();
    renderProjectProgress(); // Перерисовываем прогресс
  }
}

// Инициализация данных из localStorage или по умолчанию
function initProjectData() {
  const savedData = localStorage.getItem('projectData');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    // Обновляем данные из localStorage
    Object.keys(parsed).forEach(key => {
      if (projectData[key]) {
        projectData[key] = parsed[key];
      }
    });
  } else {
    // Если данных нет, сохраняем текущие значения по умолчанию
    saveProjectData();
  }
}

// Расчет изменения прогресса за последние 24 часа
function getProgressChange(projectId) {
  const history = JSON.parse(localStorage.getItem('progressHistory') || '[]');
  if (history.length <= 1) return { total: 0, sections: [] };
  
  const current = projectData[projectId];
  
  // Ищем запись, которая была сделана ~24 часа назад
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // Найдем запись, ближайшую к 24 часам назад
  let pastRecord = null;
  for (let i = history.length - 1; i >= 0; i--) {
    const recordDate = new Date(history[i].timestamp);
    if (recordDate <= oneDayAgo) {
      pastRecord = history[i];
      break;
    }
  }
  
  // Если нет записей старше 24 часов, берем самую старую запись
  if (!pastRecord && history.length > 0) {
    pastRecord = history[0];
  }
  
  if (!pastRecord) return { total: 0, sections: [] };
  
  const past = pastRecord[projectId];
  let totalPastProgress = 0;
  let totalCurrentProgress = 0;
  
  const sectionChanges = current.sections.map((section, index) => {
    const pastSection = past.sections[index];
    const pastProgress = pastSection ? pastSection.progress : 0;
    totalPastProgress += pastProgress;
    totalCurrentProgress += section.progress;
    
    return {
      name: section.name,
      change: section.progress - pastProgress
    };
  });
  
  const totalChange = totalCurrentProgress - totalPastProgress;
  
  return {
    total: totalChange / current.sections.length, // Среднее изменение
    sections: sectionChanges
  };
}
