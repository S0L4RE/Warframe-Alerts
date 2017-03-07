const stringThings = require("./stringThings");

module.exports = {
  /**
   * takes a 2d array and turns it into a string representation
   * of the table it should make
   * @param  {Object} array the array
   * @return {String} the table as a string
   */
  array2dtable: (array) => {
    let yourtable = "┌";
    // find longest row in array so everything has the same length
    let max_row_length = -1;
    for (let i = 0; i < array.length; i++) {
      max_row_length = Math.max(max_row_length, array[i].length);
    }
    let row_num = array.length;
    // should have a table that is of dimension
    // row_num x max_row_length
    // also have to figure out max length for each column
    let column_lengths = new Array(max_row_length).fill(-1); // this will hold the longest of each row
    for (let i = 0; i < row_num; i++) { // each row
      for (let j = 0; j < max_row_length; j++) { // each entry in the row
        let length = 0;
        if (array[i][j]) length = array[i][j].length;
        column_lengths[j] = Math.max(column_lengths[j],  length);
      }
    }
    // console.log(column_lengths); // now we know the width that each column should be
    for (let i = 0; i < column_lengths.length - 1; i++) {
      yourtable += "─".repeat(column_lengths[i]) + "┬";
    }
    yourtable += "─".repeat(column_lengths[column_lengths.length - 1]) + "┐"; // the top row
    for( let i = 0; i < row_num; i++) {
      yourtable += "\n";
      for (let j = 0; j < max_row_length - 1; j++) {
        yourtable += "│" + stringThings.padRight(array[i][j] || "", column_lengths[j]);
      }
      yourtable += "│" + stringThings.padRight(array[i][max_row_length - 1] || "", column_lengths[max_row_length - 1]) + "│";
    }
    yourtable += "\n└";
    for (let i = 0; i < column_lengths.length - 1; i++) {
      yourtable += "─".repeat(column_lengths[i]) + "┴";
    }
    yourtable += "─".repeat(column_lengths[column_lengths.length - 1]) + "┘"; // the bottom row
    return yourtable;
  }
}
