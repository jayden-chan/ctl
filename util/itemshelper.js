const fs = require('fs');
const axios = require('axios');
const ora = require('ora');
const homedir = require('os').homedir();
const netrc = require('netrc-parser').default;

/**
 * Returns the cached user items
 * @return {Object} The user's items
 */
exports.get = () => {
  return this.items;
};

/**
 * Removes the item with with the specified index.
 *
 * @param indexToSplice The index to remove
 * @return {Boolean} Whether an item was removed or not
 */
exports.splice = (indexToSplice) => {
  for (let i = 0; i < this.items.length; i++) {
    if (this.items[i].index === indexToSplice) {
      this.items.splice(i, 1);
      return true;
    }
  }

  return false;
}

exports.add = (item) => {
  this.items.push(item);
}

/**
 * Deletes the cached user items
 */
exports.clear = () => {
  this.items = null;
};

/**
 * Loads the items
 */
exports.load = (items) => {
  this.items = items;
}
