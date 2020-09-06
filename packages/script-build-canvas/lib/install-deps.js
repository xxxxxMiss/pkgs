const os = require('os')
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const { setConfig, getConfig } = require('./config')

const options = {
  encoding: 'utf8',
  stdio: 'inherit',
}

const installGccDeps = (exports.installGccDeps = () => {
  const platform = os.platform()

  if (platform === 'linux') {
    child_process.execSync(
      'yum install -y gcc-c++ cairo-devel libjpeg-turbo-devel pango-devel giflib-devel',
      options
    )
  }
  if (platform === 'darwin') {
    child_process.execSync(
      'brew install pkg-config cairo pango libpng jpeg giflib librsvg',
      options
    )
  }
})

const installNodeGyp = (exports.installNodeGyp = () => {
  try {
    child_process.execSync('which node-gyp', options)
  } catch (error) {
    console.error('[build-canvas/which node-gyp]: ', error.message)
    child_process.execSync('npm install node-gyp -g', options)
  }
})

const installAlinode = (exports.installAlinode = argv => {
  try {
    child_process.execSync('which nodeinstall', options)
  } catch (error) {
    console.error('[build-canvas/which nodeinstall]', error.message)
    child_process.execSync('npm install nodeinstall -g', options)
  }
  if (!argv.skipAlinode) {
    child_process.execSync(
      `nodeinstall --install-alinode ${argv.alinodeVersion}`,
      options
    )
  }
})

const installNodeCanvas = (exports.installNodeCanvas = argv => {
  const { clonePath } = argv
  const nodeCanvasPath = path.join(clonePath, 'node-canvas')
  if (fs.existsSync(nodeCanvasPath)) {
    console.log('[build-canvas]: node-canvas repo has existed, skip clone')
    return
  }
  child_process.execSync(
    `git clone https://github.com/Automattic/node-canvas.git --depth=1 ${clonePath}`,
    options
  )
})

const linkNodeCanvas = (exports.linkNodeCanvas = argv => {
  const { clonePath } = argv
  const nodeCanvasPath = path.join(clonePath, 'node-canvas')
  if (fs.existsSync(nodeCanvasPath)) {
    child_process.execSync(`npm link ${nodeCanvasPath}`, options)
  }
})

const hasBuild = argv => {
  const { clonePath } = argv
  return fs.existsSync(path.join(clonePath, 'node-canvas/build/Release'))
}

exports.build = arvg => {
  let config = getConfig()
  config = { ...config, ...arvg }

  if (hasBuild(config)) {
    linkNodeCanvas(config)
    return
  }

  const cwd = process.cwd()
  installGccDeps(config)
  installNodeGyp(config)
  installNodeCanvas(config)
  setConfig(config)

  const nodeCanvasPath = path.join(config.clonePath, 'node-canvas')
  console.log(`[build-canvas]: entering '${nodeCanvasPath}'`)
  process.chdir(nodeCanvasPath)
  child_process.execSync(`npm install`, options)

  console.log('[build-canvas]: deps installed, start compling...')
  child_process.execSync('node-gyp configure', options)
  child_process.execSync('node-gyp build', options)
  console.log('[build-canvas]: compling completed!')
  console.log(`[build-canvas]: leaving ${nodeCanvasPath}`)
  console.log(`[build-canvas]: current location is: ${cwd}`)
  linkNodeCanvas(config)
  installAlinode(config)
}
