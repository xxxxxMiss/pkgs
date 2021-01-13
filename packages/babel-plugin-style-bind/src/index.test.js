import pluginTester from 'babel-plugin-tester'
import styleBindPlugin from '.'
import path from 'path'

process.env.NODE_ENV = 'pkg-test'

pluginTester({
  plugin: styleBindPlugin,
  babelOptions: {
    presets: ['@babel/preset-react'],
  },
  tests: {
    'import less with jsx extname': {
      pluginOptions: {
        includes: [
          path.join(__dirname, 'fixtures', 'componentsWithJsx', '*.jsx'),
        ],
      },
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
    'not import style if extname not correct': {
      pluginOptions: {
        varName: 'cx',
        includes: [path.join(__dirname, 'fixtures', 'normalJs', '*.jsx')],
      },
      fixture: path.join(__dirname, 'fixtures', 'normalJs', 'index.js'),
      outputFixture: path.join(__dirname, 'fixtures', 'output', 'normalJs.js'),
    },
    'custom varName': {
      pluginOptions: {
        varName: 'ctx',
        includes: [
          path.join(
            __dirname,
            'fixtures',
            'componentsWithJsxAndVarName',
            '*.jsx',
          ),
        ],
      },
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
