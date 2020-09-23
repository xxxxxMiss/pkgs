module.exports = require('yargs')
  .example(
    '$0 --clone-path /root/opt --alinode-version 6.0',
    'clone node-canvas to /root/opt and install v6.0 alinode'
  )
  .example(
    '$0 --clone-path /root/opt --skip-alinode',
    'clone node-canvas to /root/opt and not install alinode'
  )
  .option('clone-path', {
    alias: 'p',
    describe: 'the target path for node-canvas clone',
    default: require('os').homedir(),
  })
  .option('alinode-version', {
    alias: 'v',
    describe: 'install the specified version alinode',
  })
  .option('skip-alinode', {
    alias: 's',
    describe: 'skip install alinode',
    type: 'boolean',
    default: false,
  })
  .option('open', {
    alias: 'o',
    describe: 'open browser to view the corresponding version of node and alinode',
    type: 'boolean',
    default: false
  })
  .demandOption(
    ['alinode-version'],
    'You must specify the version of alinode corresponding to node,\ndetails at the link `https://help.aliyun.com/document_detail/60811.html`'
  )
  .help().argv
