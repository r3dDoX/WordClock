const fs = require('fs');
const ws = fs.createWriteStream('/dev/ledchain0');

const LED_COUNT = 72;
const BYTES_PER_LED = 3;

let color = {
  r: 0x00,
  g: 0x00,
  b: 0x00,
};

const buffer = Buffer.alloc(LED_COUNT * BYTES_PER_LED);

module.exports = {
  getColor() {
    return {...color};
  },
  setColor(r, g, b) {
    color = {r, g, b}
  },
  updateChain() {
    buffer.forEach((_, index) => {
      const ledColor = index % BYTES_PER_LED;
      buffer[index] = ledColor === 0
        ? color.r
        : ledColor === 1
          ? color.g
          : color.b;
    });
    ws.write(buffer);
  },
  off() {
    buffer.forEach((_, index) => buffer[index] = 0x00);
    ws.write(buffer);
  }
}