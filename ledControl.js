const fs = require('fs');
const ws = fs.createWriteStream('/dev/ledchain0');
const configHelper = require('./config');

const config = configHelper.getConfig();
const LED_COUNT = 224;
const BYTES_PER_LED = 3;

const buffer = Buffer.alloc(LED_COUNT * BYTES_PER_LED);

/**
 * E S K E S C H F Z Ä H
 * V I E R T U B F Ö I F
 * Z W Ä N Z G S I V O R
 * A B O H A L B I E P M
 * E I S Z W Ö I S D R Ü
 * V I E R I F Ö I F I T
 * S Ä C H S I S E B N I
 * A C H T I N Ü N I E L
 * Z Ä H N I R B E L F I
 * Z W Ö L F I A M U H R
 *
 * Every odd row has to be reversed du to how they will be soldered
 */
const LEDS_PER_LETTER = 2;
const NONE = 0;
const CONSTANT = 1;
const FÖIF = 2;
const ZÄH = 3;
const VIERTU = 4;
const ZWÄNZG = 5;
const HALBI = 6;
const EIS = 7;
const ZWÖI = 8;
const DRÜ = 9;
const VIERI = 10;
const FÖIFI = 11;
const SÄCHSI = 12;
const SEBNI = 13;
const ACHTI = 14;
const NÜNI = 15;
const ZÄHNI = 16;
const ELFI = 17;
const ZWÖLFI = 18;
const VOR = 19;
const AB = 20;

const LED_ARRAY = [
  [CONSTANT, CONSTANT, NONE, CONSTANT, CONSTANT, CONSTANT, CONSTANT, NONE, ZÄH, ZÄH, ZÄH],
  [FÖIF, FÖIF, FÖIF, FÖIF, NONE, VIERTU, VIERTU, VIERTU, VIERTU, VIERTU, VIERTU],
  [ZWÄNZG, ZWÄNZG, ZWÄNZG, ZWÄNZG, ZWÄNZG, ZWÄNZG, NONE, NONE, VOR, VOR, VOR],
  [NONE, NONE, NONE, HALBI, HALBI, HALBI, HALBI, HALBI, NONE, AB, AB],
  [EIS, EIS, EIS, ZWÖI, ZWÖI, ZWÖI, ZWÖI, NONE, DRÜ, DRÜ, DRÜ],
  [NONE, FÖIFI, FÖIFI, FÖIFI, FÖIFI, FÖIFI, VIERI, VIERI, VIERI, VIERI, VIERI],
  [SÄCHSI, SÄCHSI, SÄCHSI, SÄCHSI, SÄCHSI, SÄCHSI, SEBNI, SEBNI, SEBNI, SEBNI, SEBNI],
  [NONE, NONE, NÜNI, NÜNI, NÜNI, NÜNI, ACHTI, ACHTI, ACHTI, ACHTI, ACHTI],
  [ZÄHNI, ZÄHNI, ZÄHNI, ZÄHNI, ZÄHNI, NONE, NONE, ELFI, ELFI, ELFI, ELFI],
  [NONE, NONE, NONE, NONE, NONE, ZWÖLFI, ZWÖLFI, ZWÖLFI, ZWÖLFI, ZWÖLFI, ZWÖLFI],
];

module.exports = {
  getColor() {
    return {...config.color};
  },
  setColor(r, g, b) {
    config.color = {r, g, b};
    return configHelper.saveConfig();
  },
  updateChain(groups) {
    const {r, g, b} = this.getColor();
    for (let row = 0; row < LED_ARRAY.length; row++) {
      for (let col = 0; col < LED_ARRAY[row].length; col++) {
        const groupKey = LED_ARRAY[row][col];
        const ledIndex = LEDS_PER_LETTER * BYTES_PER_LED * (row * LED_ARRAY[row].length + col);
        const isLit = groups.includes(groupKey);
        for (let i = 0; i < LEDS_PER_LETTER * BYTES_PER_LED; i++) {
          if (isLit) {
            const colorIndex = ledIndex % 3;
            buffer[ledIndex + i] = colorIndex === 0
              ? r
              : colorIndex === 1
                ? g
                : b;
          } else {
            buffer[ledIndex + i] = 0x00;
          }
        }
      }
    }
    ws.write(buffer);
  },
  off() {
    buffer.forEach((_, index) => buffer[index] = 0x00);
    ws.write(buffer);
  }
}