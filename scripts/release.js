const child_process = require('child_process')

const privateRegistry = 'http://172.17.3.163:80/'
const publicRegistry = 'http://nexus.iblockplay.com:8082/repository/npm-hosted/'

child_process.exec(
  `yarn publish --access public --registry ${privateRegistry}`,
  (err, stdout, stderr) => {
    if (err) {
      console.log(`[learna publish]: ${stdout}`)
      console.error(`[learna publish]: ${stderr}`)
    } else {
      child_process.execSync(`yarn publish --registry ${publicRegistry}`)
    }
  },
)
