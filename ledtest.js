const fs = require('fs');
const ws = fs.createWriteStream('/dev/ledchain0');

const LED_COUNT = 72;
const BYTES_PER_LED = 3;

const RED = 0;
const GREEN = 1;
const BLUE = 2;

let selectedColor = RED;

const buffer = new Buffer(LED_COUNT * BYTES_PER_LED);
ws.write(buffer);

function isSelectedColor(byteIndex) {
  return byteIndex % 3 === selectedColor;
}

function updateBuffer(leds) {
  for(let i = 0; i < LED_COUNT * BYTES_PER_LED; i++) {
    buffer[i] = isSelectedColor(i) && leds.includes(Math.floor(i/BYTES_PER_LED))
      ? 0xff
      : 0x00;
  }

  ws.write(buffer);
}

let led = 0;
function test() {
  if (led < LED_COUNT) {
    updateBuffer([led++]);
    setTimeout(test, 30);
  } else if (selectedColor < BLUE) {
    selectedColor++;
    led = 0;
    setTimeout(test, 30);
  } else {
    ws.write(new Buffer(LED_COUNT * BYTES_PER_LED));
    ws.close();
  }
}

module.exports = test;