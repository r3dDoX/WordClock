require('./install');
const express = require('express');
const configHelper = require('./config');
const timezone = require('./timezone');
const ledControl = require('./ledControl');
const wifi = require('./wifi');
const clock = require('./clock');

const config = configHelper.getConfig();

const app = express();
app.use(express.json());
app.use(express.static('assets'));

app.post('/timezone', (req, res) => {
  const {timezoneName, timezoneString} = req.query;
  timezone.setTimezone(timezoneName, timezoneString)
    .then(() => {
      config.timezone = [timezoneName, timezoneString];
      return configHelper.saveConfig();
    })
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err));
});

app.get('/timezone', (req, res) => {
  res.send(timezone.getTimezone().join(', '));
})

app.get('/timezones', (req, res) => {
  timezone.getTimezones()
    .then(timezones => res.send(timezones))
    .catch(err => res.status(500).send(err));
});

app.get('/led/color', (req, res) => {
  res.send(ledControl.getColor());
});

app.post('/led/color', (req, res) => {
  const {r, g, b} = req.query;
  ledControl.setColor(parseInt(r, 10), parseInt(g, 10), parseInt(b, 10))
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err));
});

app.post('/led/off', (req, res) => {
  ledControl.off();
  res.sendStatus(200);
});

app.get('/wifi/scan', (req, res) => {
  wifi.scanForWifiNetworks()
    .then(networks => res.send(networks))
    .catch(err => res.status(500).send(err));
});

app.get('/wifi/list', (req, res) => {
  wifi.getConfiguredWifiNetworks()
    .then(ssids => res.send(ssids))
    .catch(err => res.status(500).send(err));
});

app.delete('/wifi/:ssid', (req, res) => {
  wifi.removeConfiguredWifiNetwork(req.params.ssid)
    .then(() => res.sendStatus(200))
    .catch(err => err.status(500).send(err));
});

app.post('/wifi/:ssid', (req,res) => {
  wifi.addWifiConfiguration(req.params.ssid, req.body.encryption, req.body.password)
    .then(() => res.sendStatus(200))
    .catch(err => err.status(500).send(err));
});

app.listen(81, () => console.log('Webserver started'));
clock();
