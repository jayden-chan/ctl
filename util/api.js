const fs = require('fs');
const axios = require('axios');
const ora = require('ora');
const homedir = require('os').homedir();
const netrc = require('netrc-parser').default;

/**
 * Returns whether or not the user is logged in
 * @return {boolean} Whether or not the user is logged in
 */
exports.isLoggedIn = () => {
  const path = homedir + '/.netrc';
  const netrc = fs.readFileSync(path, 'utf8');

  return netrc.indexOf('machine ctl-server.herokuapp.com') >= 0;
};

/**
 * Gets the user's login token
 * @return {string} The login token
 */
exports.getToken = () => {
  return netrc.machines['ctl-server.herokuapp.com'].password;
};

/**
 * Returns the cached user items
 * @return {Object} The user's items
 */
exports.getItems = () => {
  return this.items;
};

/**
 * Removes the item with with the specified index.
 *
 * @param indexToSplice The index to remove
 * @return {Boolean} Whether an item was removed or not
 */
exports.spliceItem = (indexToSplice) => {
  for (let i = 0; i < this.items.length; i++) {
    if (this.items[i].index === indexToSplice) {
      this.items.splice(i, 1);
      return true;
    }
  }

  return false;
}

/**
 * Deletes the cached user items
 */
exports.clearItems = () => {
  this.items = null;
};

/**
 * Retrieves the user's items and other data from the cloud
 */
exports.refreshSync = async (message) => {
  netrc.loadSync();
  if (!exports.isLoggedIn()) {
    return;
  }

  const token = exports.getToken();
  const spinner = ora(message).start();
  await axios({
    method: 'get',
    url: 'https://ctl-server.herokuapp.com/items',
    headers: { Authorization: 'Bearer '+token }
  })
    .then(response => {
      if (response.status >= 200) {
        this.items = response.data.items;
        this.items.forEach((item, i) => {
          item.index = i+1;
        });
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
};

/**
 * Refreshes the user's items asynchronously
 */
exports.refresh = async () => {
  netrc.loadSync();
  if (!exports.isLoggedIn()) {
    return;
  }

  const token = exports.getToken();
  await axios({
    method: 'get',
    url: 'https://ctl-server.herokuapp.com/items',
    headers: { Authorization: 'Bearer '+token }
  })
    .then(response => {
      if (response.status >= 200) {
        this.items = response.data.items;
        this.items.forEach((item, i) => {
          item.index = i+1;
        });
      }
    })
    .catch(() => {
      this.items = null;
    });
};
