const git = require('isomorphic-git')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
// const dayjs = require('dayjs')

;(async () => {
  if (process.env.HUSKY_GIT_STDIN.indexOf('tags') === -1) return

  const tags = await git.listTags({ fs, gitdir: path.join(__dirname, '.git') })
  const latest = tags[tags.length - 1]

  const vp = path.join(process.cwd(), 'VERSION')
  fs.writeFileSync(vp, latest)

  shell.exec('git add .')
  shell.exec(`git commit -m 'Add tag ${latest}'`)
})()
