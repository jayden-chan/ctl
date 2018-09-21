const prompts = require('prompts');
const axios = require('axios');
const ora = require('ora');
const fs = require('fs');
const homedir = require('os').homedir();
        
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
      fs.appendFileSync(homedir + '/.netrc', 
        'machine ctl-server.herokuapp.com\n'+
        '  login ' + email.value +
        '  password ' + response.data.token + '\n');

      spinner.succeed('Successfully logged in');
    })
    .catch(error => {
      if(error.response.status === 401) {
        spinner.fail(error.response.data)
      } else {
        spinner.fail('Login attempt failed. Please try again later');
      }
    })
}
