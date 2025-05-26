// src/utils/sensorNumber.js
function sensorNumber(number) {
    if (!number || typeof number !== "string" || number.length < 6) {
        return number;
    }

    const start = number.slice(0, 3);
    const end = number.slice(-3);
    const censored = "*".repeat(number.length - 6);

    return `${start}${censored}${end}`;
}

export default sensorNumber;
