import Listr from 'listr'
import shell from 'shelljs'
import path from 'path'

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  }

  const currentFileUrl = import.meta.url;
  const templateDirectory = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../../'
  );


  const tasks = new Listr([
    {
      title: 'Clone Repository',
      task: () => {
        shell.cd(templateDirectory)
        shell.exec('git clone https://github.com/topspinppy/express-decorator-api-boilerplate')
      }
    },
    {
      title: 'Initialized Project',
      task: () => {
        shell.exec('rm -rf .git')
        const json = require(`${templateDirectory}/express-decorator-api-boilerplate/package.json`)
        json.name = options.projectName
        json.author = options.author
        require('fs').writeFileSync(`${templateDirectory}/express-decorator-api-boilerplate/package.json`, JSON.stringify(json, null, 2))
      }
    }
  ])

  tasks.run().catch(err => {
    console.error(err)
  })
}
