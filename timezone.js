const {exec} = require('child_process');
const configHelper = require('./config');

const config = configHelper.getConfig();

module.exports = {
  getTimezone() {
    return config.timezone;
  },
  setTimezone(timezoneName, timezoneString) {
    return new Promise((resolve, reject) => {
      exec(`onion time set ${timezoneName} ${timezoneString}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error Code: ${error.code}, Error Signal: ${error.signal}`);
          reject(stderr.toString());
        } else {
          resolve(stdout.toString());
        }
      });
    });
  },
  getTimezones() {
    return new Promise((resolve, reject) => {
      exec('onion time list', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error Code: ${error.code}, Error Signal: ${error.signal}`);
          reject(stderr.toString());
        } else {
          const parsedTimezones = stdout
            .toString()
            .split('\n')
            .map(timezone => timezone.split('\t'));
          parsedTimezones.shift(); // remove header
          parsedTimezones.pop(); // remove empty last line
          resolve(parsedTimezones);
        }
      });
    });
  }
}