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
  const path = homedir + '/.netrc';
  const netrc = fs.readFileSync(path, 'utf8');

  let shouldContinue = true;
  const loginIndex = netrc.indexOf('machine ctl-server.herokuapp.com');
  if (loginIndex >= 0) {
    const confirm = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Existing user credentials found in storage. Overwrite?',
      initial: true
    });

    if (confirm.value) {
      fs.readFile(path, 'utf8', function(err, data)
        {
          if (err) throw err;

          var endIndex = netrc.indexOf('machine', loginIndex+8);
          endIndex = endIndex < 0 ? netrc.length : endIndex;

          const newData = data.slice(0, loginIndex).concat(data.slice(endIndex));
          fs.writeFileSync(path, newData);
        });
    }

    shouldContinue = confirm.value;
  }

  if (shouldContinue) {
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
      .then(async response => {
        fs.appendFileSync(path,
          'machine ctl-server.herokuapp.com\n'+
          '  login ' + email.value + '\n'+
          '  password ' + response.data.token + '\n');
        spinner.succeed('Successfully logged in');
      })
      .catch(error => {
        spinner.fail(error.response.data);
      });
  } else {
    const spinner = ora('Aborting').start().fail();
  }

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
