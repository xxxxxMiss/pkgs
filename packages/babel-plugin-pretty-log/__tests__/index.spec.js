import pluginTester from 'babel-plugin-tester'
import prettyLog from '../src/index'

pluginTester({
  plugin: prettyLog,
  pluginName: 'pretty-log',
  pluginOptions: {},
  snapshot: false,
  tests: {
    tagedTemplateLog: {
      code: 'log`${a} this is text`',
      output: 'console.log(`${a} this is text`)',
    },
  },
})
