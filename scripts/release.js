const child_process = require('child_process')

const privateRegistry = 'http://172.17.3.128:4873'
const publicRegistry = 'http://nexus.iblockplay.com:8082/repository/npm-hosted/'

child_process.execSync(`lerna publish --registry ${privateRegistry}`)
child_process.execSync(`lerna publish --registry ${publicRegistry}`)
