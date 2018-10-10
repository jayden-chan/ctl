const ora = require('ora');
const apihelper = require('../util/apihelper.js');
const itemshelper = require('../util/itemshelper.js');
const printer = require('../util/printer.js');

/**
 * Lists all items
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.list = async (args, callback) => {
  if (!apihelper.isLoggedIn()) {
    ora('Not logged in').start().fail();
  } else {
    // Get the items from the apihelper and perform a deep copy.
    // JSON method is the fastest deep copy that I know of
    let items = JSON.parse(JSON.stringify(itemshelper.get()));

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
  if (!apihelper.isLoggedIn()) {
    ora('Not logged in').start().fail();
  } else {
    await apihelper.refreshSync('Refreshing items...');
  }

  callback();
};

/**
 * Adds a new item
 * @param args     Command arguments
 * @param callback Callback function
 *
 * TODO: Make API able to handle multiple
 * additions/deletions in one request
 */
exports.add = function(args, callback) {
  if (args.description !== undefined) {
    const folder = args.options.f || '';
    const due = args.options.d || '';
    const status = args.options.s || 'pending';
    const desc = args.description.join(' ');
    const itemsLen = itemshelper.get().length;

    itemshelper.add({
      status: status,
      due: due,
      folder: folder,
      description: desc,
      index: itemsLen+1
    });

    ora('Item created').start().succeed();
  } else {
    ora('Please provide a description').start().fail();
  }

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
    const removed = itemshelper.splice(index);

    if (removed) {
      ora('Item deleted').start().succeed();
    } else {
      ora('Item does not exist').start().fail();
    }
  }

  callback();
}
