function generateRandomNumber(maxNumber) {
    var randomNumber = '';
    for (var i = 0; i < maxNumber; i++) {
        randomNumber += Math.floor(Math.random() * 10);
    }
    return parseInt(randomNumber);
}

module.exports = { generateRandomNumber }