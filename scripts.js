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
const incompleteTasksBlock = document.querySelector(".incompleted-tasks");
const completedTasksBlock=document.querySelector(".completed-tasks");

addTaskInput.addEventListener('keypress', handleEnterPress);

function handleEnterPress(event) {
  if (event.which === 13 || event.keyCode === 13) {
    addTask(addTaskInput.value);
  }
}

function createNewTask(taskString) {
  const nodes = {
    'task': null,
    'box': null,
    'checkbox': null,
    'editInput': null,
    'editButton': null,
    'editButtonImg': null,
    'removeButton': null,
    'removeButtonImg': null
  }
  const htmlElements = ['li', 'div', 'input', 'input', 'button', 'img', 'button', 'img'];
  const classNames = [
    'input-group',
    'input-group-text bg-transparent',
    'form-check-input mt-0',
    'form-control transparent-input',
    'btn btn-outline-secondary',
    null,
    'btn btn-outline-secondary',
    null
  ];
  const types = [null, null, 'checkbox', 'text', 'button', null, 'button', null]

  const images = [null, null, null, null, null, { src: "./assets/edit.svg", alt: "edit" }, null, { src: "./assets/remove.svg", alt: "remove"}]

  let i = 0
  for(let key in nodes) {
    nodes[key] = document.createElement(htmlElements[i]);
    classNames[i] && (nodes[key].className = classNames[i]);
    types[i] && (nodes[key].type = types[i]);
    images[i] && (nodes[key].src = images[i].src, nodes[key].alt = images[i].alt);
    i++
  }

  nodes.editInput.value = taskString;
  nodes.editInput.disabled = true;

  nodes.editButton.appendChild(nodes.editButtonImg);
  nodes.removeButton.appendChild(nodes.removeButtonImg);
  nodes.box.appendChild(nodes.checkbox);
  nodes.task.appendChild(nodes.box);
  nodes.task.appendChild(nodes.editInput);
  nodes.task.appendChild(nodes.editButton);
  nodes.task.appendChild(nodes.removeButton);

  return nodes.task;
}

function addTask(){
  if (!addTaskInput.value) return;                             // ToDo добавить тостер

  const listItem = createNewTask(addTaskInput.value);
  incompleteTasksBlock.appendChild(listItem);

  addTaskInput.value="";
}