const ora = require('ora');
const axios = require('axios');
const apiHelper = require('../util/api.js');

/**
 * Lists all items
 * @param args     Command arguments
 * @param callback Callback function
 */
exports.list = async (args, callback) => {
  if (!apiHelper.isLoggedIn()) {
    ora('Not logged in').start().fail();
  } else {
    const token = apiHelper.getToken();
    const spinner = ora('Getting items...').start();
    await axios({
      method: 'get',
      url: 'https://ctl-server.herokuapp.com/items',
      headers: { Authorization: 'Bearer '+token }
    })
      .then(response => {
        if (response.status >= 200) {
          spinner.stop();
          console.log(response.data);
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

  callback();
};
