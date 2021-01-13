const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const lerna = require.resolve('lerna/cli')
const chalk = require('chalk')

const exec = (command, args, options) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: process.env,
      stdio: 'inherit',
      ...options,
    })
    child.on('error', error => {
      console.error(error)
      reject(error)
    })
    child.on('close', code => {
      if (code) {
        process.exit(1)
      } else {
        resolve()
      }
    })
  })
}

const getPkgs = () => {
  const packagesDir = path.join(process.cwd(), 'packages')
  return fs
    .readdirSync(packagesDir)
    .filter(dir => !dir.startsWith('.'))
    .map(dir => path.join(packagesDir, dir))
}

const privateRegistry = 'http://172.17.3.163:80/'
const publicRegistry = 'http://nexus.iblockplay.com:8082/repository/npm-hosted/'

;(async () => {
  await exec(lerna, ['publish', '--registry', privateRegistry])
  // sync to nexus
  getPkgs().forEach(pkg => {
    exec('npm', ['publish', pkg, '--registry', publicRegistry]).then(() => {
      const { name, version } = require(pkg)
      console.log(chalk.green(`Sync successfully: ${name}@${version}`))
    })
  })
})()
