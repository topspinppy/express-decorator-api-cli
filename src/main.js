import Listr from 'listr'
import shell from 'shelljs'
import path from 'path'
import os from 'os'

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  }

  const homeDirectory = path.join(os.homedir(), "Desktop")


  const tasks = new Listr([
    {
      title: 'Clone Repository',
      task: () => {
        console.log(`🏡 Home Directory Path 🏡 | ${homeDirectory}`)
        shell.cd(homeDirectory)
        shell.exec('git clone https://github.com/topspinppy/express-decorator-api-boilerplate')
      }
    },
    {
      title: 'Initialized Project',
      task: () => {
        shell.cd(homeDirectory)
        shell.exec('rm -rf .git')
        const json = require(`${homeDirectory}/express-decorator-api-boilerplate/package.json`)
        json.name = options.projectName
        json.author = options.author
        require('fs').writeFileSync(`${homeDirectory}/express-decorator-api-boilerplate/package.json`, JSON.stringify(json, null, 2))
      }
    },
    {
      title: 'Change Project Name',
      task: () => {
        require('fs').renameSync(`${homeDirectory}/express-decorator-api-boilerplate`,`${homeDirectory}/${options.projectName}`)
      }
    }
  ])

  tasks.run().catch(err => {
    console.error(err)
  })
}
