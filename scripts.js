const container = document.getElementById('main-container');

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
  const hourIndex = triggerHours.reduce((a, c, i) => c < nowHour ? i : a, 0)
  const timeToChange = new Date(date.getFullYear(), date.getMonth(), date.getDate(), triggerHours[hourIndex + 1])
  const msToNextChange = timeToChange - date;
  return msToNextChange;
}

updateBackground();


