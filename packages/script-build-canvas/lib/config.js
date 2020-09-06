const fs = require('fs')
const path = require('path')
const os = require('os')

exports.getConfig = function getConfig() {
  let config = path.join(os.homedir(), '.build-canvas')
  if (fs.existsSync(config)) {
    config = fs.readFileSync(config, 'utf-8')
    return JSON.parse(config)
  }
  return {}
}

exports.setConfig = function setConfig(config) {
  const text = JSON.stringify(config)
  fs.writeFileSync(path.join(os.homedir(), '.build-canvas'), text)
}
