const body = document.body;

function getMinute(minutes) {
    return minutes % 5;
}

function getPrefix(roundedMinutes) {
    if (roundedMinutes > 35 || roundedMinutes === 25) {
        return 'front';
    } else if (roundedMinutes >= 5 && roundedMinutes < 25 || roundedMinutes === 35) {
        return 'back';
    }
    return '';
}

function getBundle(roundedMinutes) {
    switch (roundedMinutes) {
        case 5:
        case 25:
        case 35:
        case 55:
            return '1';
        case 15:
        case 45:
            return '2';
        case 10:
        case 50:
            return '3';
        case 20:
        case 40:
            return '4';
        default:
            return '';
    }
}

function getHalf(roundedMinutes) {
    return roundedMinutes >= 25 && roundedMinutes < 40
        ? 'half'
        : '';
}

function getHours(minutes, hours) {
    const hourToShow = minutes >= 25 ? hours + 1 : hours;
    return hourToShow % 12;
}

function updateClock(minutes, hours) {
    const roundedMinutes = Math.floor(minutes / 5) * 5;
    body.dataset.minute = getMinute(minutes);
    body.dataset.bundle = getBundle(roundedMinutes);
    body.dataset.half = getHalf(minutes);
    body.dataset.prefix = getPrefix(roundedMinutes);
    body.dataset.hour = getHours(minutes, hours);
}

function updateInterval() {
    const currentDate = new Date();
    const currentSeconds = currentDate.getSeconds();
    const timerSeconds = 60 - currentSeconds;
    const timerMilliseconds = timerSeconds * 1000;
    console.log('next update at: ' + new Date(currentDate.getTime() + timerMilliseconds));
    setTimeout(updateInterval, timerMilliseconds);
    updateClock(currentDate.getMinutes(), currentDate.getHours());
}

updateInterval();
