/**
 * Clears the console
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.clear = (args, callback) => {
  console.clear();
  callback();
};
