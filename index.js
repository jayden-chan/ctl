const vorpal = require('vorpal')();
const items = require('./handlers/items.js');
const simple = require('./handlers/simple.js');

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
  .delimiter('ctl $')
  .show();
