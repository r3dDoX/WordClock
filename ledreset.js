const fs = require('fs');

const LED_COUNT = 72;
const BYTES_PER_LED = 3;

fs.writeFile('/dev/ledchain0', new Buffer(LED_COUNT * BYTES_PER_LED), (err) => {
  if (err) {
    console.error(err);
  }
  console.log('reset');
})
