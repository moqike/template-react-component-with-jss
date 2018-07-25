const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Generate component
 * @param targetPath absolute path where to generate the compnent
 */
async function generate(targetPath){
  const componentName = await getComponentName(targetPath);
  const componentPath = path.resolve(targetPath, componentName);
  const templateData = {
    name: componentName
  };
  if (!isComponentFolderExist(targetPath, componentName)) {
    generateComponentFolder(componentPath);
  }
  generateComponentFiles(componentPath, templateData);
  console.log(chalk.green(`===finsihed: ${componentName} created!===`))
}

async function getComponentName(targetPath) {
  let isComponentNameValid = false;
  let componentName = null;
  while (!isComponentNameValid) {
    componentName = (await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the component name'
    })).name;
    const isComponentExist = isComoponentExist(targetPath, componentName);
    if (isComponentExist) {
      console.log(chalk.red(`${componentName} files already exists!`));
    } else {
      console.log(chalk.green(`component name valid: ${componentName}`))
      isComponentNameValid = true;
    }
  }
  return componentName;
}

function isComoponentExist(targetPath, componentName) {
  let componentExist = false;
  const componentFolderExist = isComponentFolderExist(targetPath, componentName);
  if (componentFolderExist) {
    const componentFilesExist = isComponentFilesExist(targetPath, componentName);
    if (componentFilesExist) {
      componentExist = true;
    }
  }
  return componentExist;
}

function isComponentFolderExist(targetPath, componentName) {
  let componentFolderExists = false;
  const componentPath = path.join(targetPath, componentName);
  try {
    fs.accessSync(componentPath);
    componentFolderExists = true;
  } catch(e) {
  }
  return componentFolderExists;
}

function isComponentFilesExist(targetPath, componentName) {
  let componentFileExists = false;
  const componentPath = path.join(targetPath, componentName);
  const componentIndexPath = path.join(componentPath, 'index.tsx');
  const componentStylesPath = path.join(componentPath, 'styles.ts');
  try {
    fs.accessSync(componentIndexPath);
    fs.accessSync(componentStylesPath);
    componentFileExists = true;
  } catch(e) {
    // TODO: check e.code === ENOENT
  }
  return componentFileExists;
}

function generateComponentFolder(componentPath) {
  const spinner = ora('creating component folder').start();
  fs.mkdirSync(componentPath);
  spinner.stop();
  console.log(chalk.green('component folder created!'));
}

function generateComponentFiles(componentPath, templateData) {
  const encoding = 'utf-8';
  const spinner = ora('creating component files').start();
  let componentTemplate = fs.readFileSync(path.resolve(__dirname, '../TemplateComponent/index.tsx.hbs'), encoding);
  let styleTemplate = fs.readFileSync(path.resolve(__dirname, '../TemplateComponent/styles.ts.hbs'), encoding);
  componentTemplate = Handlebars.compile(componentTemplate);
  styleTemplate = Handlebars.compile(styleTemplate);
  fs.writeFileSync(path.join(componentPath, 'index.tsx'), componentTemplate(templateData));
  fs.writeFileSync(path.join(componentPath, 'styles.ts'), styleTemplate(templateData));
  spinner.stop();
  console.log(chalk.green('component filse created!'));
}

module.exports = generate;
