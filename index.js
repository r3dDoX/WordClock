const express = require('express');
const {exec} = require('child_process');
const test = require('./ledtest.js');

const app = express();

app.use(express.static('assets'));

app.get('/timezones', function (req, res) {
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

app.post('/ledtest', function (req, res) {
  test();
  res.sendStatus(200);
});

app.listen(3000);
