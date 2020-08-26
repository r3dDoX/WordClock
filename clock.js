const ledControl = require('./ledControl');

let currentMinute;

function getMinute(minutes) {
  return minutes % 5;
}

function getPrefix(roundedMinutes) {
  if (roundedMinutes > 35 || roundedMinutes === 25) {
    return ledControl.VOR;
  } else if (roundedMinutes >= 5 && roundedMinutes < 25 || roundedMinutes === 35) {
    return ledControl.AB;
  }
}

function getBundle(roundedMinutes) {
  switch (roundedMinutes) {
    case 5:
    case 25:
    case 35:
    case 55:
      return ledControl.FOEIF;
    case 15:
    case 45:
      return ledControl.VIERTU;
    case 10:
    case 50:
      return ledControl.ZAEH;
    case 20:
    case 40:
      return ledControl.ZWAENZG;
  }
}

function getHalf(roundedMinutes) {
  if (roundedMinutes >= 25 && roundedMinutes < 40) {
    return ledControl.HALBI;
  }
}

function getHours(minutes, hours) {
  const hourToShow = minutes >= 25 ? hours + 1 : hours;
  switch(hourToShow % 12) {
    case 1:
      return ledControl.EIS;
    case 2:
      return ledControl.ZWOEI;
    case 3:
      return ledControl.DRUE;
    case 4:
      return ledControl.VIERI;
    case 5:
      return ledControl.FOEIFI;
    case 6:
      return ledControl.SAECHSI;
    case 7:
      return ledControl.SEBNI;
    case 8:
      return ledControl.ACHTI;
    case 9:
      return ledControl.NUENI;
    case 10:
      return ledControl.ZAEHNI;
    case 11:
      return ledControl.ELFI;
    case 12:
      return ledControl.ZWOELFI;
  }
}

function updateClock(minutes, hours) {
  const roundedMinutes = Math.floor(minutes / 5) * 5;
  ledControl.updateChain(
    [
      ledControl.CONSTANT,
      getBundle(roundedMinutes),
      getHalf(minutes),
      getPrefix(minutes),
      getHours(minutes, hours),
    ].filter(value => value !== undefined),
    getMinute(minutes)
  );
}

function updateInterval() {
  const currentDate = new Date();
  setTimeout(updateInterval, 1000 - currentDate.getMilliseconds());
  if (currentMinute !== currentDate.getMinutes()) {
    currentMinute = currentDate.getMinutes();
    updateClock(currentDate.getMinutes(), currentDate.getHours());
  }
}

module.exports = updateInterval;
