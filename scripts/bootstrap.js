const fs = require('fs')
const path = require('path')

;(() => {
  const target = path.join(process.cwd(), 'packages')
  const pkgs = fs.readdirSync(target, 'utf-8')
  pkgs.forEach((pkg) => {
    const packageJson = {
      name: pkg,
      version: '1.0.0',
      description: pkg,
      main: 'lib/index.js',
      files: ['lib', 'src'],
      repository: {
        type: 'git',
        url:
          'https://gitlab.intranet.huiyin.com/union/qdjj/jiansu-front-basic.git',
      },
      keywords: [pkg],
      license: 'MIT',
      private: false,
      publishConfig: {
        access: 'public',
      },
    }
    const t = path.join(target, pkg, 'package.json')
    if (!fs.existsSync(t)) {
      fs.writeFileSync(t, JSON.stringify(packageJson, null, 2))
    } else {
      const existPkgJson = require(t)
      Object.keys(packageJson).forEach((key) => {
        if (!existPkgJson[key]) {
          existPkgJson[key] = packageJson[key]
        }
      })
      fs.writeFileSync(t, JSON.stringify(existPkgJson, null, 2))
    }

    const readme = path.join(target, pkg, 'README.md')
    if (!fs.existsSync(readme)) {
      fs.writeFileSync(readme, `## ${pkg}\n> this is desc`)
    }
  })
})()
