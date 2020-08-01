const fs = require('fs');
const ws = fs.createWriteStream('/dev/ledchain0');
const configHelper = require('./config');

const config = configHelper.getConfig();
const LED_COUNT = 150;
const BYTES_PER_LED = 3;

const buffer = Buffer.alloc(LED_COUNT * BYTES_PER_LED);

module.exports = {
  getColor() {
    return {...config.color};
  },
  setColor(r, g, b) {
    config.color = {r, g, b};
    return configHelper.saveConfig();
  },
  updateChain() {
    buffer.forEach((_, index) => {
      const ledColor = index % BYTES_PER_LED;
      buffer[index] = ledColor === 0
        ? config.color.r
        : ledColor === 1
          ? config.color.g
          : config.color.b;
    });
    ws.write(buffer);
  },
  off() {
    buffer.forEach((_, index) => buffer[index] = 0x00);
    ws.write(buffer);
  }
}