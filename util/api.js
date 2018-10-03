const fs = require('fs');
const axios = require('axios');
const ora = require('ora');
const homedir = require('os').homedir();
const netrc = require('netrc-parser').default

/**
 * Returns whether or not the user is logged in
 * @return {boolean} Whether or not the user is logged in
 */
exports.isLoggedIn = () => {
  const path = homedir + '/.netrc';
  const netrc = fs.readFileSync(path, 'utf8');

  return netrc.indexOf('machine ctl-server.herokuapp.com') >= 0;
}

/**
 * Gets the user's login token
 * @return {string} The login token
 */
exports.getToken = () => {
  return netrc.machines['ctl-server.herokuapp.com'].password;
}

/**
 * Retrieves the user's items and other data from the cloud
 */
exports.sync = async () => {
  netrc.loadSync()
  if (!exports.isLoggedIn()) {
    return;
  }

  const token = exports.getToken();
  const spinner = ora('Login credentials found, synchronizing...').start();
  await axios({
    method: 'get',
    url: 'https://ctl-server.herokuapp.com/items',
    headers: { Authorization: 'Bearer '+token }
  })
    .then(response => {
      if (response.status >= 200) {
        spinner.succeed('Items synced');
      }
    })
    .catch(error => {
      if (error.response.status === 400) {
        spinner.fail(error.response.data);
      } else if (error.response.status === 404) {
        spinner.fail('No items found');
      } else {
        spinner.fail('Items retrieval failed. Please try again later (code '+error.response.status+')');
      }
    });
}
