const vorpal = require('vorpal')();
const handlers = require('./handlers.js');

vorpal
  .command('ls', 'Lists all items')
  .option('-a', 'Lists all items including hidden')
  .action(handlers.list);

vorpal
  .command('clear', 'Clears the virtual terminal')
  .alias('c')
  .action(handlers.clear);

vorpal
  .command('test', 'Random testing function')
  .option('-f', 'Force test')
  .action(handlers.test);

vorpal
  .delimiter('ctl $')
  .show();
