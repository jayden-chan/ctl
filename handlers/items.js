const ora = require('ora');
const apiHelper = require('../util/api.js');
const printer = require('../util/printer.js');

/**
 * Lists all items
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.list = async (args, callback) => {
  if (!apiHelper.isLoggedIn()) {
    ora('Not logged in').start().fail();
  } else {
    // Get the items from the apiHelper and perform a deep copy
    // JSON method is the fastest deep copy that I know of
    let items = JSON.parse(JSON.stringify(apiHelper.getItems()));

    if (args.options.s) {
      items.sort((a, b) => {
        if (a.status < b.status)
          return 1;
        if (a.status > b.status)
          return -1;
        return 0;
      });
    } else if (args.options.d) {
      items.sort((a, b) => {
        if (a.due < b.due)
          return -1;
        if (a.due > b.due)
          return 1;
        return 0;
      });
    } else if (args.options.f) {
      items.sort((a, b) => {
        if (a.folder < b.folder)
          return -1;
        if (a.folder > b.folder)
          return 1;
        return 0;
      });
    }

    if (args.options.r) {
      items.reverse();
    }

    printer.printObj(items);
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
