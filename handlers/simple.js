const { Console } = require('console');

exports.clear = (args, callback) => {
  Console.clear();
  callback();
};

exports.test = (args, callback) => {
  Console.log(args);
  callback();
};
