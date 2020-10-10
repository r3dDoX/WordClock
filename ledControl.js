const fs = require('fs');
const ws = fs.createWriteStream('/dev/ledchain0');
const configHelper = require('./config');

const config = configHelper.getConfig();
const LED_COUNT = 224;
const BYTES_PER_LED = 3;
const LEDS_PER_LETTER = 2;
const COLOR_OFF = {r: 0x00, g: 0x00, b: 0x00};

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
 * Every odd row has to be reversed due to how they will be soldered
 */
const NONE = 0;
const CONSTANT = 1;
const FOEIF = 2;
const ZAEH = 3;
const VIERTU = 4;
const ZWAENZG = 5;
const HALBI = 6;
const EIS = 7;
const ZWOEI = 8;
const DRUE = 9;
const VIERI = 10;
const FOEIFI = 11;
const SAECHSI = 12;
const SEBNI = 13;
const ACHTI = 14;
const NUENI = 15;
const ZAEHNI = 16;
const ELFI = 17;
const ZWOELFI = 18;
const VOR = 19;
const AB = 20;

const LED_ARRAY = [
  [ZWOELFI, ZWOELFI, ZWOELFI, ZWOELFI, ZWOELFI, ZWOELFI, NONE, NONE, NONE, NONE, NONE],
  [ELFI, ELFI, ELFI, ELFI, NONE, NONE, ZAEHNI, ZAEHNI, ZAEHNI, ZAEHNI, ZAEHNI],
  [ACHTI, ACHTI, ACHTI, ACHTI, ACHTI, NUENI, NUENI, NUENI, NUENI, NONE, NONE],
  [SEBNI, SEBNI, SEBNI, SEBNI, SEBNI, SAECHSI, SAECHSI, SAECHSI, SAECHSI, SAECHSI, SAECHSI],
  [VIERI, VIERI, VIERI, VIERI, VIERI, FOEIFI, FOEIFI, FOEIFI, FOEIFI, FOEIFI, NONE],
  [DRUE, DRUE, DRUE, NONE, ZWOEI, ZWOEI, ZWOEI, ZWOEI, EIS, EIS, EIS],
  [AB, AB, NONE, HALBI, HALBI, HALBI, HALBI, HALBI, NONE, NONE, NONE],
  [VOR, VOR, VOR, NONE, NONE, ZWAENZG, ZWAENZG, ZWAENZG, ZWAENZG, ZWAENZG, ZWAENZG],
  [VIERTU, VIERTU, VIERTU, VIERTU, VIERTU, VIERTU, NONE, FOEIF, FOEIF, FOEIF, FOEIF],
  [ZAEH, ZAEH, ZAEH, NONE, CONSTANT, CONSTANT, CONSTANT, CONSTANT, NONE, CONSTANT, CONSTANT],
];

let currentGroups = [CONSTANT];
let currentMinutes = 0;

module.exports = {
  getColor() {
    return {...config.color};
  },
  setColor(r, g, b) {
    config.color = {r, g, b};
    this.updateChain(currentGroups, currentMinutes);
    return configHelper.saveConfig();
  },
  updateChain(groups, minutes) {
    currentGroups = groups;
    currentMinutes = minutes;
    const color = this.getColor();
    for (let row = 0; row < LED_ARRAY.length; row++) {
      for (let col = 0; col < LED_ARRAY[row].length; col++) {
        setLEDColor(
          LEDS_PER_LETTER * BYTES_PER_LED * (row * LED_ARRAY[row].length + col),
          LEDS_PER_LETTER,
          groups.includes(LED_ARRAY[row][col]) ? color : COLOR_OFF,
        );
      }
    }
    for (let minute = 1; minute < 5; minute++) {
      setLEDColor(
        BYTES_PER_LED * (LED_COUNT - (4 - minute)),
        1,
        minutes !== 0 && minute <= minutes ? color : COLOR_OFF,
      );
    }
    ws.write(buffer);
  },
  off() {
    buffer.forEach((_, index) => buffer[index] = 0x00);
    ws.write(buffer);
  },
  NONE,
  CONSTANT,
  FOEIF,
  ZAEH,
  VIERTU,
  ZWAENZG,
  HALBI,
  EIS,
  ZWOEI,
  DRUE,
  VIERI,
  FOEIFI,
  SAECHSI,
  SEBNI,
  ACHTI,
  NUENI,
  ZAEHNI,
  ELFI,
  ZWOELFI,
  VOR,
  AB,
}

function setLEDColor(ledIndex, amount, {r, g, b}) {
  for (let i = 0; i < amount * BYTES_PER_LED; i++) {
    const colorIndex = (ledIndex + i) % 3;
    buffer[ledIndex + i] = colorIndex === 0
      ? r
      : colorIndex === 1
        ? g
        : b;
  }
}
