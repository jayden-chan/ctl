const { Console } = require('console');

exports.list = (args, callback) => {
  Console.log('Listing items');
  callback();
};
