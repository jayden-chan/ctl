const vorpal = require('vorpal')();
const items = require('./handlers/items.js');
const simple = require('./handlers/simple.js');
const api = require('./handlers/api.js');
const apiUtil = require('./util/api.js');

// Commands
vorpal
  .command('ls', 'List all items')
  .option('-s', 'Sort by status')
  .option('-d', 'Sort by due date')
  .option('-f', 'Sort by folder')
  .option('-r', 'Reverse sort')
  .action(items.list);

vorpal
  .command('refresh', 'Refresh items')
  .alias('rf')
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
  if (apiUtil.isLoggedIn()) {
    await apiUtil.refreshSync('Login credentials found, refeshing items...');
  }

  // Start Vorpal
  vorpal
    .delimiter('ctl >')
    .show();

})();
