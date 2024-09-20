const container = document.getElementById('main-container');

let timeOfBackgroundSetting;

function updateBackground() {
  const times = ['night', 'morning', 'day', 'evening']
  const now = new Date();
  let hours = now.getHours();
  const timeIndex = Math.floor((hours / 6));
  container.className = times[timeIndex];
  timeOfBackgroundSetting = now;
}

updateBackground();


