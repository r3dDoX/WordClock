const fs = require('fs');
const ws = fs.createWriteStream('/dev/ledchain0');

const LED_COUNT = 72;
const BYTES_PER_LED = 3;

const buffer = new Buffer(LED_COUNT * BYTES_PER_LED);
ws.write(buffer);

