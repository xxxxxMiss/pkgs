const { spawn } = require('child_process')
const lerna = require.resolve('lerna/cli')

const exec = (command, args, options) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: process.env,
      stdio: 'inherit',
      ...options,
    })
    child.on('error', (error) => {
      console.error(error)
      reject(error)
    })
    child.on('close', (code) => {
      if (code) {
        process.exit(1)
      } else {
        resolve()
      }
    })
  })
}

const privateRegistry = 'http://172.17.3.163:80/'
const publicRegistry = 'http://nexus.iblockplay.com:8082/repository/npm-hosted/'

exec(lerna, ['publish', '--registry', privateRegistry]).then(() => {
  exec(lerna, ['publish', '--registry', publicRegistry])
})
