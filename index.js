require('./install');
const express = require('express');
const {exec} = require('child_process');
const ledControl = require('./ledControl');

const app = express();
app.use(express.static('assets'));

app.get('/timezones', (req, res) => {
  exec('onion time list', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error Code: ${error.code}, Error Signal: ${error.signal}`);
      res.send(stderr);
    }

    const parsedTimezones = stdout.toString().split('\n').map(timezone => timezone.split('\t'));
    parsedTimezones.shift(); // remove header
    parsedTimezones.pop(); // remove empty last line
    res.send(parsedTimezones);
  });
});

app.get('/led/color', (req, res) => {
  res.send(ledControl.getColor());
});

app.post('/led/color', (req, res) => {
  const {r, g, b} = req.query;
  ledControl.setColor(r, g, b);
  res.sendStatus(200);
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
