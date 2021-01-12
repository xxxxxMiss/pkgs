import pluginTester from 'babel-plugin-tester'
import styleBindPlugin from '.'
import path from 'path'

process.env.NODE_ENV = 'pkg-test'

pluginTester({
  plugin: styleBindPlugin,
  pluginOptions: {
    includes: [path.join(__dirname, 'fixtures', 'componentsWithJsx', '*.jsx')],
  },
  babelOptions: {
    presets: ['@babel/preset-react'],
  },
  tests: {
    'import less with jsx extname': {
      fixture: path.join(
        __dirname,
        'fixtures',
        'componentsWithJsx',
        'index.jsx',
      ),
      outputFixture: path.join(
        __dirname,
        'fixtures',
        'output',
        'componentWithJsx.jsx',
      ),
    },
  },
})

pluginTester({
  plugin: styleBindPlugin,
  pluginOptions: {
    varName: 'cx',
    includes: [path.join(__dirname, 'fixtures', 'normalJs', '*.jsx')],
  },
  babelOptions: {
    presets: ['@babel/preset-react'],
  },
  tests: {
    'not import style if extname not correct': {
      fixture: path.join(__dirname, 'fixtures', 'normalJs', 'index.js'),
      outputFixture: path.join(__dirname, 'fixtures', 'output', 'normalJs.js'),
    },
  },
})

pluginTester({
  plugin: styleBindPlugin,
  pluginOptions: {
    varName: 'ctx',
    includes: [
      path.join(__dirname, 'fixtures', 'componentsWithJsxAndVarName', '*.jsx'),
    ],
  },
  babelOptions: {
    presets: ['@babel/preset-react'],
  },
  tests: {
    'custom varName': {
      fixture: path.join(
        __dirname,
        'fixtures',
        'componentsWithJsxAndVarName',
        'index.jsx',
      ),
      outputFixture: path.join(
        __dirname,
        'fixtures',
        'output',
        'componentsWithJsxAndVarName.jsx',
      ),
    },
  },
})
