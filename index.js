const vorpal = require('vorpal')();
const items = require('./handlers/items.js');
const simple = require('./handlers/simple.js');
const api = require('./handlers/api.js');
const apiUtil = require('./util/api.js');

// Commands
vorpal
  .command('ls', 'Lists all items')
  .option('-a', 'Lists all items including hidden')
  .action(items.list);

vorpal
  .command('clear', 'Clears the virtual terminal')
  .alias('c')
  .action(simple.clear);

vorpal
  .command('test', 'Random testing function')
  .option('-f', 'Force test')
  .action(simple.test);

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
    await apiUtil.sync();
  }

  // Start Vorpal
  vorpal
    .delimiter('ctl >')
    .show();

})();
