const vorpal = require('vorpal')();
const items = require('./handlers/items.js');
const simple = require('./handlers/simple.js');
const api = require('./handlers/api.js');
const apihelper = require('./util/apihelper.js');

// Commands
vorpal
  .command('list', 'List all items')
  .alias('l')
  .option('-s', 'Sort by status')
  .option('-d', 'Sort by due date')
  .option('-f', 'Sort by folder')
  .option('-r', 'Reverse sort')
  .action(items.list);

vorpal
  .command('add [description...]', 'Add a new item')
  .alias('a')
  .option('-f <folder>', 'Folder to add item under')
  .option('-d <due>', 'Specify due date')
  .option('-s <status>', 'Specify status')
  .action(items.add);

vorpal
  .command('delete <num>', 'Delete an item')
  .alias('d')
  .action(items.delete);

vorpal
  .command('refresh', 'Refresh items')
  .alias('r')
  .action(items.refresh);

vorpal
  .command('clear', 'Clear the terminal')
  .alias('c')
  .action(simple.clear);

vorpal
  .command('register', 'Register a new account')
  .action(api.register);

vorpal
  .command('login', 'Log in')
  .action(api.login);

vorpal
  .command('logout', 'Log out')
  .action(api.logout);

(async () => {
  // Sync if logged in
  if (apihelper.isLoggedIn()) {
    await apihelper.refreshSync('Login credentials found, refeshing items...');
  }

  // Start Vorpal
  vorpal
    .delimiter('ctl >')
    .show();

})();
