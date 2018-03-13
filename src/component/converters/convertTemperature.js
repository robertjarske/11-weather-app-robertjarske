export function convertTemperature(isCelsius, temp) {
  return isCelsius === true ? temp : (temp * 9 / 5 + 32).toFixed(2);
}
