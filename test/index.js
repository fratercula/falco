const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const falco = require('../')
const { tree } = require('../')

const dir = join(__dirname, 'example')
const js = 'console.log(1)'
const css = 'body { background: grey; }'
const treeData = tree(dir)

falco({
  // entry: { js, css },
  // entry: [{ js, css }],
  entry: {
    main: 'index.js',
    // data: treeData,
    path: dir,
  },
  moduleRules: [],
  registry: 'https://registry.npm.taobao.org',
  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
  port: 8000, // 2222
  mode: 'development', // 'production'
  esModules: true, // true
  cssModule: false, // false
})
  .then(({ code, sourceMap, dependencies }) => {
    if (!code) {
      return
    }

    console.log(dependencies)
    outputFileSync(join(__dirname, 'output.js'), code)
    if (sourceMap) {
      outputFileSync(join(__dirname, 'output.js.map'), sourceMap)
    }
  })
  .catch(err => console.log(err))
