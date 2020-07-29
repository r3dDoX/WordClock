const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json').toString());

module.exports = {
  getConfig() {
    return config;
  },
  saveConfig() {
    return new Promise((resolve, reject) => {
      fs.writeFile('./config.json', JSON.stringify(config), err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }
}