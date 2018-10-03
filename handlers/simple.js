/**
 * Clears the console
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.clear = (args, callback) => {
  console.clear();
  callback();
};

/**
 * Function for testing only
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.test = (args, callback) => {
  console.log(args);
  callback();
};
