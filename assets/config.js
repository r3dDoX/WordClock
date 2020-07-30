document.addEventListener("DOMContentLoaded", () => {
  const currentTimezoneElement = document.getElementById('current-timezone');
  const colorInput = document.getElementById('color');

  function getCurrentTimezone() {
    fetch('/timezone')
      .then(timezone => timezone.text())
      .then(timezone => currentTimezoneElement.innerText = timezone.split(',')[0]);
  }

  function decToHex(decimalNumber) {
    return decimalNumber.toString(16).padStart(2, '0');
  }

  function getCurrentColor() {
    fetch('/led/color')
      .then(color => color.json())
      .then(({r, b, g}) => colorInput.value = `#${decToHex(r)}${decToHex(g)}${decToHex(b)}`);
  }

  fetch('/timezones')
    .then(zones => zones.json())
    .then(parsedZones => {
      const timeZonesSelect = document.getElementById('timezones');
      timeZonesSelect.append(...parsedZones.map(zone => {
        const option = document.createElement('option');
        option.setAttribute('value', `${zone[0]}|${zone[1]}`);
        option.innerText = zone[0];
        return option;
      }));
      timeZonesSelect.addEventListener('change', event => {
        const selectedTimeZone = event.target.value.split('|');
        fetch(
          `/timezone?timezoneName=${encodeURIComponent(selectedTimeZone[0])}&timezoneString=${encodeURIComponent(selectedTimeZone[1])}`,
          {method: 'POST'}
        )
          .then(getCurrentTimezone);
      })
    });

  colorInput.addEventListener('change', event => {
    const [, r, g, b] = event.target.value.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    fetch(
      `/led/color?r=${parseInt(r, 16)}&g=${parseInt(g, 16)}&b=${parseInt(b, 16)}`,
      {method: 'POST'}
    )
      .then(getCurrentColor);
  });

  getCurrentTimezone();
  getCurrentColor();
  document.getElementById('on').addEventListener('click', () => {
    fetch(
      '/led/on',
      {method: 'POST'}
    )
  });
  document.getElementById('off').addEventListener('click', () => {
    fetch(
      '/led/on',
      {method: 'POST'}
    )
  });
});