const chalk = require('chalk');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const fs = require('fs');

const fileExists = fs.existsSync('./.resources.json');

const createConfigFile = () => {
  console.log(chalk`
Hello! 👋

{bold.red IMPORTANT} 🚨 You are about to configure the source of the resources for the Romi Dashboard project `);
  console.log(chalk`
You have two options:
{cyan →} 1. {blue get} the assets from a remote GH source.
{cyan →} 2. {blue copy} assets from a specific folder.
`);

  inquirer
    .prompt([
      {
        name: 'GET_OR_COPY',
        message: chalk`{blue What option are you going to choose?}`,
        validate: (input) => /^[1-2-]$/.test(input) || 'Invalid option',
      },
      {
        name: 'REPO',
        message: `Set REPO. Example: https://github.com/open-rmf/rmf_demos.git`,
        when: (keys) => keys['GET_OR_COPY'] === '1',
        validate: (input) =>
          /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
            input,
          ) || 'Not a valid URL',
      },
      // TODO: change to "main" when rmf completes the switch
      {
        name: 'BRANCH',
        message: `Set BRANCH. Example: master`,
        when: (keys) => !!keys['REPO'],
        default: 'master',
      },
      {
        name: 'FOLDER',
        message: `Set FOLDER. Leave it empty to clone the whole project. Example: rmf_dashboard_resources/office/`,
        when: (keys) => !!keys['BRANCH'],
        default: '',
      },
      {
        name: 'COPY',
        message: 'Set absolute PATH',
        when: (keys) => keys['GET_OR_COPY'] === '2',
        validate: (input) => /^(\/[^\/]+){0,20}\/?$/gm.test(input) || 'Not a valid PATH',
      },
    ])
    .then((keys) => {
      let information;
      if (keys.GET_OR_COPY === '1') {
        information = { repoUrl: keys.REPO, folder: keys.FOLDER, branch: keys.BRANCH };
      }
      if (keys.GET_OR_COPY === '2') {
        information = { path: keys.COPY };
      }
      fs.writeFile('.resources.json', JSON.stringify(information), function (err) {
        if (err) {
          exec('mv .bak-resources.json .resources.json');
          throw err;
        }
        console.log(chalk`{green File .resources.json was created successfully.}`);
        try {
          exec('rm .bak-resources.json');
        } catch (error) {}
      });
    })
    .catch((error) => console.error(error));
};

if (fileExists) {
  console.log(chalk`
  {blue Hello! 👋 You already configured a resource source!
  1. Continue and do nothing.
  2. Do you want to modify it? (You can also update the values manually on .resources.json) }`);

  inquirer
    .prompt({
      name: 'QUIT_OR_MODIFY',
      message: chalk`{blue What option are you going to choose?}`,
      validate: (input) => /^[1-2-]$/.test(input) || 'Invalid option',
      default: 1,
    })
    .then((keys) => {
      if (keys.QUIT_OR_MODIFY === '1') {
        return;
      }
      if (keys.QUIT_OR_MODIFY === '2') {
        // Rename and save a copy of the file
        exec('mv .resources.json .bak-resources.json', (error, stdout, stderr) => {
          if (error) {
            console.error(chalk`{red exec error: ${error}}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          createConfigFile();
        });
      }
    })
    .catch((error) => console.error(error));
}

if (!fileExists) {
  createConfigFile();
}
