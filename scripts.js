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


