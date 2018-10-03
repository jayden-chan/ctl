const ora = require('ora');
const apiHelper = require('../util/api.js');

/**
 * Lists all items
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.list = async (args, callback) => {
  if (!apiHelper.isLoggedIn()) {
    ora('Not logged in').start().fail();
  } else {
    console.log(apiHelper.getItems());
  }

  callback();
};

/**
 * Refreshes the user's items
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.refresh = async (args, callback) => {
  if (!apiHelper.isLoggedIn()) {
    ora('Not logged in').start().fail();
  } else {
    await apiHelper.refreshSync('Refreshing items...');
  }

  callback();
};
