function updateBackgroundSlider() {
  const container = document.getElementById('main-container');
    const times = ['night', 'morning', 'day', 'evening']
    const now = new Date();
    let hours = now.getHours();
    if (hours === 0) {
        hours = 24;
    }
    const timeIndex = Math.floor((hours / 6) % times.length);
    container.className = times[timeIndex];
}

updateBackgroundSlider();