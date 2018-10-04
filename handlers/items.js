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
    // Get the items from the apiHelper and perform a deep copy.
    // JSON method is the fastest deep copy that I know of
    let items = JSON.parse(JSON.stringify(apiHelper.getItems()));

    if (args.options.s) {
      const priorty = new Map();
      priorty.set('overdue', 2);
      priorty.set('pending', 1);
      priorty.set('complete', 0);

      items.sort((a, b) => {
        const ap = priorty.get(a.status);
        const bp = priorty.get(b.status);
        return (ap < bp) ? 1 : (bp < ap) ? -1 : 0;
      });
    } else if (args.options.d) {
      items.sort((a, b) => (a.due < b.due) ? 1 : (b.due < a.due) ? -1 : 0);
    } else if (args.options.f) {
      items.sort((a, b) => (a.folder < b.folder) ? 1 : (b.folder < a.folder) ? -1 : 0);
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

/**
 * Adds a new item
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.add = function(args, callback) {
  console.log(args);
  callback();
}

/**
 * Deletes an item
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.delete = function(args, callback) {
  const index = Number(args.num);

  if (!index) {
    ora('Not a valid number').start().fail();
  } else {
    const removed = apiHelper.spliceItem(index);

    if (removed) {
      ora('Item deleted').start().succeed();
    } else {
      ora('Item does not exist').start().fail();
    }
  }

  callback();
}
