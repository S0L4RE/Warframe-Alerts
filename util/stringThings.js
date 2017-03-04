module.exports = {
  padRight: (string = "", length) => {
    // assume string length is less than length
    return string + " ".repeat(length - string.length);
  },
  padLeft: (string = "", length) => {
    // assume string length is less than length
    return " ".repeat(length - string.length) + string;
  }
}
