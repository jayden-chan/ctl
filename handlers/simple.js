exports.clear = (args, callback) => {
  console.clear();
  callback();
}

exports.test = (args, callback) => {
  console.log(args);
  callback();
}
