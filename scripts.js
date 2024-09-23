const container = document.getElementById('main-container');
const clock = document.querySelector('.clock');
const calendar = document.querySelector('.date');

let timeOfBackgroundSetting;

function updateBackground() {
  const times = ['night', 'morning', 'day', 'evening']
  const now = new Date();
  const hours = now.getHours();
  const timeIndex = Math.floor((hours / 6));
  container.className = times[timeIndex];
  timeOfBackgroundSetting = now;

  setTimeout(updateBackground, getTimeToChangeBackground(timeOfBackgroundSetting));
}

function getTimeToChangeBackground (date) {
  const nowHour = date.getHours();
  const triggerHours = [0, 6, 12, 18, 24];
  const hourIndex = triggerHours.reduce((a, c, i) => c < nowHour ? i : a, 0);
  const timeToChange = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    triggerHours[hourIndex + 1]
  );
  const msToNextChange = timeToChange - date;
  return msToNextChange;
}

updateBackground();

function getCurrentDateTime() {
  const now = new Date();
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }
  const dateOptions = {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  };
    const time = now.toLocaleTimeString('ru', timeOptions);
    const date = now.toLocaleDateString('ru', dateOptions).split(',').reverse().join(', ');
    return {time, date};
}

const setTimeAndDate = () => {
  const {time, date} = getCurrentDateTime()
  clock.textContent = time;
  calendar.textContent = date;
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeAndDate()
});

setInterval(() => {
  setTimeAndDate();
}, 1000);


async function fetchWeatherData(position) {
  try {
    const { latitude, longitude } = position.coords;
    API_KEY = '605a4f6530242597cb90bc04b8f384e9';
    const response = await fetch(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=Краснодар`);
    const data = await response.json();
    const cityNameElement = document.querySelector('.city-name');
    const tempElement = document.querySelector('.temperature');
    const conditionElement = document.querySelector('.condition');
    cityNameElement.textContent = decodeURIComponent(data.location.name);
    tempElement.textContent = `${Math.round(data.current.temperature)}°C`;
    const img = document.createElement('img');
    img.src = data.current.weather_icons;
    img.style.borderRadius = '50%'
    conditionElement.appendChild(img);
  } catch (error) {
      console.log(`Произошла ошибка при получении данных о погоде: ${error.message}`);
      return null;
  }
}

// success, error

navigator.geolocation.getCurrentPosition(fetchWeatherData)


// TODO
const addTaskInput = document.querySelector('.form-control');
const incompleteTasksBlock = document.querySelector('.incomplete-tasks');
const completedTasksBlock = document.querySelector('.completed-tasks');

if (localStorage.getItem('momentum_incompleteTasks') !== null) {
  const storedData = JSON.parse(localStorage.getItem('momentum_incompleteTasks'));
  for (let storedTask of storedData) {
    const task = createTaskElement(storedTask, false);
    incompleteTasksBlock.appendChild(task);
    bindTaskEvents(task, taskCompleted);
  }
}

if (localStorage.getItem('momentum_completedTasks') !== null) {
  const storedData = JSON.parse(localStorage.getItem('momentum_completedTasks'));
  for (let storedTask of storedData) {
    const task = createTaskElement(storedTask, true);
    completedTasksBlock.appendChild(task);
    bindTaskEvents(task, taskIncomplete);
  }
}

addTaskInput.addEventListener('keypress', handleEnterPress);

function handleEnterPress(event) {
  if (event.which === 13 || event.keyCode === 13) {
    addTask(addTaskInput.value);
  }
}

function createTaskElement(taskString, isCompleted) {
  const nodes = {
    task: { element: null, htmlElement: 'li', attr: {class: 'input-group d-flex flex-row'} },
    box: { element: null, htmlElement: 'div', parent: 'task', attr: { class: 'input-group-text', title: 'Завершить' } },
    checkbox: { element: null, htmlElement: 'input', parent: 'box', attr: {class: 'form-check-input mt-0', type: 'checkbox', title: 'Завершить'} },
    editInput: { element: null, htmlElement: 'input', parent: 'task', attr: { class: 'form-control transparent-input', type: 'text', value: taskString, disabled: true } },
    editButton: { element: null, htmlElement: 'button', parent: 'task', attr: {class: 'btn edit btn-outline-secondary', type: 'button', title: 'Изменить'} },
    editButtonImg: { element: null, htmlElement: 'img', parent: 'editButton', attr: {src: './assets/edit.svg', alt: 'edit'} },
    removeButton: { element: null, htmlElement: 'button', parent: 'task', attr: {class: 'btn remove btn-outline-secondary', type: 'button', title: 'Удалить'} },
    removeButtonImg: { element: null, htmlElement: 'img', parent: 'removeButton', attr: { src: './assets/remove.svg', alt: 'remove' } },
  }

  for (let key in nodes) {
    nodes[key].element = document.createElement(nodes[key].htmlElement);
    const newElement = nodes[key].element;

    const attributes = nodes[key].attr;
    for (let prop in attributes) {
      newElement.setAttribute(prop, attributes[prop]);
    }

    key === 'checkbox' && (newElement.checked = isCompleted);

    if (key !== 'task') {
      const parentElement = nodes[nodes[key].parent].element;
      parentElement.appendChild(newElement);
    }
  }

  return nodes.task.element;
}

function addTask(){
  if (!addTaskInput.value) return;                             // ToDo добавить тостер

  const taskDescription = addTaskInput.value;
  const task = createTaskElement(taskDescription, false);

  saveChangeToLocalStorage('momentum_incompleteTasks', 'add', taskDescription)

  incompleteTasksBlock.appendChild(task);
  bindTaskEvents(task, taskCompleted);

  addTaskInput.value="";
}

function saveChangeToLocalStorage(key, action, task) {
  if (localStorage.getItem(key) !== null) {
    const storedData = JSON.parse(localStorage.getItem(key));
    updateStoredData(key, action, storedData, task);
  } else {
    const newData = [task];
    setStoredData(key, newData);
  }
}

function updateStoredData(key, action, storedData, task) {
  switch (action) {
  case 'add':
    storedData.push(task);
    break;
  case 'delete':
    const index = storedData.indexOf(task);
    storedData.splice(index, 1);
    break;
  }
  const jsonData = JSON.stringify(storedData);
  localStorage.setItem(key, jsonData);
}

function setStoredData(key, task) {
  const jsonData = JSON.stringify(task);
  localStorage.setItem(key, jsonData);
}

function taskCompleted() {
  const listItem = this.parentNode.parentElement;
  const task = listItem.querySelector("input[type=text]").value;
  completedTasksBlock.appendChild(listItem);
  saveChangeToLocalStorage('momentum_completedTasks', 'add', task)
  saveChangeToLocalStorage('momentum_incompleteTasks', 'delete', task)
  bindTaskEvents(listItem, taskIncomplete);
}

function taskIncomplete() {
  const listItem = this.parentNode.parentElement;
  const task = listItem.querySelector("input[type=text]").value;
  incompleteTasksBlock.appendChild(listItem);
  saveChangeToLocalStorage('momentum_completedTasks', 'delete', task)
  saveChangeToLocalStorage('momentum_incompleteTasks', 'add', task)
  bindTaskEvents(listItem,taskCompleted);
}

function deleteTask() {
  const listItem = this.parentNode;
  const taskDescription = listItem.querySelector('.form-control').value;
  const taskBlock = listItem.parentNode;
  const key = taskBlock.classList.contains('completed-tasks')
    ? 'momentum_completedTasks'
    : 'momentum_incompleteTasks';
  taskBlock.removeChild(listItem);
  saveChangeToLocalStorage(key, 'delete', taskDescription);
}

function editTask() {
  const listItem = this.parentNode;
  const taskInput = listItem.querySelector('.form-control')
  const oldTaskDescription = taskInput.value;
  taskInput.disabled = false;
  taskInput.focus();
  const taskBlock = listItem.parentNode;
  const key = taskBlock.classList.contains('completed-tasks')
    ? 'momentum_completedTasks'
    : 'momentum_incompleteTasks';
  taskInput.onchange = () => {
    if (oldTaskDescription !== taskInput.value) {
      const newTaskDescription = taskInput.value;
      saveChangeToLocalStorage(key, 'delete', oldTaskDescription);
      saveChangeToLocalStorage(key, 'add', newTaskDescription);
      taskInput.disabled = true;
    }
  }
}

function bindTaskEvents(task, checkBoxEventHandler){

  const checkBox = task.querySelector("input[type=checkbox]");
  const editButton = task.querySelector(".btn.edit");
  const deleteButton = task.querySelector(".btn.remove");

  editButton.onclick = editTask;

  deleteButton.onclick = deleteTask;

  checkBox.onchange = checkBoxEventHandler;
}
