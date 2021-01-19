const axios = require('axios')
const fs = require('fs')
const path = require('path')

class SendSourceMapWebpackPlguin {
  constructor(options) {
    this.options = options
    this.pkgInfo = require(path.join(process.cwd(), 'package.json'))
  }
  apply(compiler) {
    compiler.hooks.done.tap('SendSourceMapWebpackPlguin', () => {
      const { output, mode } = compiler.options
      if (mode != 'production') return
      const files = fs.readdirSync(output.path)
      for (let file of files) {
        if (/\.map$/.test(file)) {
          const sourcemapPath = path.join(output.path, file)
          const dataBuffer = fs.readFileSync(sourcemapPath)
          axios
            .post(
              this.options.host + '/error/save-sourcemap',
              {
                data: dataBuffer,
                options: {
                  ...this.options,
                  version: 'v1',
                  filename: file,
                  projectName: this.pkgInfo.name,
                },
              },
              {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
              },
            )
            .then(() => {
              fs.unlinkSync(sourcemapPath)
            })
        }
      }
    })
  }
}

module.exports = SendSourceMapWebpackPlguin
