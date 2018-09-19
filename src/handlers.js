exports.clear = (args, callback) => {
  console.clear();
  callback();
}

exports.list = (args, callback) => {
  console.log('Listing items...');
  callback();
}

exports.test = (args, callback) => {
  console.log(args);
  callback();
}
