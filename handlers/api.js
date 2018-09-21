const prompts = require('prompts');
const axios = require('axios');
const ora = require('ora');
const fs = require('fs');
const homedir = require('os').homedir();

exports.register = async (args, callback) => {
  const email = await prompts({
    type: 'text',
    name: 'value',
    message: 'Email:'
  });

  const password = await prompts({
    type: 'password',
    name: 'value',
    message: 'Password:'
  });

  const spinner = ora('Creating account...').start();

  await axios.post('https://ctl-server.herokuapp.com/register', {
    email: email.value,
    password: password.value
  })
    .then(response => {
      if (response.status >= 200) {
        spinner.succeed('Account created. Login with the \'login\' command');
      }
    })
    .catch(error => {
      if (error.response.status === 400) {
        spinner.fail(error.response.data);
      } else {
        spinner.fail('Account creation failed. Please try again later (code '+error.response.status+')');
      }
    });

  callback();
};

exports.login = async (args, callback) => {
  const email = await prompts({
    type: 'text',
    name: 'value',
    message: 'Email:'
  });

  const password = await prompts({
    type: 'password',
    name: 'value',
    message: 'Password:'
  });

  const spinner = ora('Logging in...').start();

  await axios.post('https://ctl-server.herokuapp.com/login', {
    email: email.value,
    password: password.value
  })
    .then(response => {
      let hasLogin = false;
      fs.readFile(homedir + '/.netrc', function (err, data) {
        if (err) throw err;
        if (data.indexOf('machine ctl-server.herokuapp.com') >= 0) {
          console.log(data);
        }
      });

      if (hasLogin) {

      }
      fs.appendFileSync(homedir + '/.netrc',
        'machine ctl-server.herokuapp.com\n'+
        '  login ' + email.value + '\n'+
        '  password ' + response.data.token + '\n');

      spinner.succeed('Successfully logged in');
    })
    .catch(error => {
      if (error.response.status === 401) {
        spinner.fail(error.response.data);
      } else {
        spinner.fail('Login attempt failed. Please try again later');
      }
    });

  callback();
};

exports.logout = async(args, callback) => {

  // TODO: Finish implementing API endpoint

  //   const spinner = ora('Logging out...').start();

  //   await axios.post('https://ctl-server.herokuapp.com/logout',)
  //     .then(response => {
  //       spinner.succeed('Successfully logged out');
  //     })
  //     .catch(error => {
  //       if(error.response.status === 401) {
  //         spinner.fail(error.response.data);
  //       } else {
  //         spinner.fail('Login attempt failed. Please try again later');
  //       }
  //     });
  callback();
};
