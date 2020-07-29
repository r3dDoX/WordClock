require('./install');
const express = require('express');
const configHelper = require('./config');
const timezone = require('./timezone');
const ledControl = require('./ledControl');

const config = configHelper.getConfig();

const app = express();
app.use(express.static('assets'));

app.post('/timezone', (req, res) => {
  const {timezoneName, timezoneString} = req.query;
  timezone.setTimezone(timezoneName, timezoneString)
    .then(() => {
      config.timezone = [timezoneName, timezoneString];
      return configHelper.saveConfig();
    })
    .then(() => res.sendStatus(200))
    .catch(err => res.send(err));
});

app.get('/timezone', (req, res) => {
  res.send(timezone.getTimezone().join(', '));
})

app.get('/timezones', (req, res) => {
  timezone.getTimezones()
    .then(timezones => res.send(timezones))
    .catch(err => res.send(err));
});

app.get('/led/color', (req, res) => {
  res.send(ledControl.getColor());
});

app.post('/led/color', (req, res) => {
  const {r, g, b} = req.query;
  ledControl.setColor(parseInt(r, 10), parseInt(g, 10), parseInt(b, 10))
    .then(() => res.sendStatus(200))
    .catch(err => res.send(err));
});

app.post('/led/on', (req, res) => {
  ledControl.updateChain();
  res.sendStatus(200);
});

app.post('/led/off', (req, res) => {
  ledControl.off();
  res.sendStatus(200);
});

app.listen(3000);
