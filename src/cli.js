import { createProject } from './main';

const arg = require('arg')
const inquirer = require('inquirer')

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    projectName: args._[0],
    author: '',
    runInstall: args['--install'] || false,
  };
}

async function promptForMissingOptions(options) {
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];

  if (!options.projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'What would you like to name the project?',
      default: 'express-decorator-boilerplate-api',
    });
  }

  if (!options.author) {
    questions.push({
      type: 'input',
      name: 'author',
      message: 'Please enter the author\'s name?',
      default: 'Topspinppy',
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    author: options.author || answers.author,
    projectName: options.projectName || answers.projectName,
    git: options.git || answers.git,
  };
}
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options)
  await createProject(options)
}