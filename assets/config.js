document.addEventListener("DOMContentLoaded", () => {
  const colorInput = document.getElementById('color');
  const timeZonesSelect = document.getElementById('timezones');
  const configuredWifiList = document.getElementById('configured-wifis');

  function decToHex(decimalNumber) {
    return decimalNumber.toString(16).padStart(2, '0');
  }

  function getCurrentColor() {
    fetch('/led/color')
      .then(color => color.json())
      .then(({r, b, g}) => colorInput.value = `#${decToHex(r)}${decToHex(g)}${decToHex(b)}`);
  }

  function updateConfiguredWifis() {
    fetch('/wifi/list')
      .then(ssids => {
        configuredWifiList.append(
          ssids.map(ssid => {
            const li = document.createElement('li');
            li.innerText = ssid;
            li.value = ssid;
            return li;
          })
        );
      });
  }

  fetch('/timezone')
    .then(timezone => timezone.text())
    .then((currentTimezone) => {
      fetch('/timezones')
        .then(zones => zones.json())
        .then(parsedZones => {
          const timezoneName = currentTimezone.split(',')[0];
          timeZonesSelect.append(...parsedZones.map(zone => {
            const option = document.createElement('option');
            option.setAttribute('value', `${zone[0]}|${zone[1]}`);
            option.innerText = zone[0];
            if (zone[0] === timezoneName) {
              option.setAttribute('selected', 'true');
            }
            return option;
          }));
        });
    })

  timeZonesSelect.addEventListener('change', event => {
    const selectedTimeZone = event.target.value.split('|');
    fetch(
      `/timezone?timezoneName=${encodeURIComponent(selectedTimeZone[0])}&timezoneString=${encodeURIComponent(selectedTimeZone[1])}`,
      {method: 'POST'}
    );
  });

  colorInput.addEventListener('change', event => {
    const [, r, g, b] = event.target.value.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    fetch(
      `/led/color?r=${parseInt(r, 16)}&g=${parseInt(g, 16)}&b=${parseInt(b, 16)}`,
      {method: 'POST'}
    )
      .then(getCurrentColor);
  });

  document.getElementById('off').addEventListener('click', () => {
    fetch(
      '/led/off',
      {method: 'POST'}
    )
  });

  getCurrentColor();
  updateConfiguredWifis();
});
