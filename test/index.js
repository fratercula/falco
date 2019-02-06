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
    data: treeData,
    // path: dir,
  },
  moduleRules: [],
  registry: 'https://registry.npm.taobao.org',
  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
  port: 8000, // 2222
  // mode: 'developoment', // 'production'
  esModules: true, // true
  cssModule: false, // false
})
  .then(({ js, sourceMap, dependencies }) => {
    console.log(dependencies)
    outputFileSync(join(__dirname, 'output.js'), js)
    if (sourceMap) {
      outputFileSync(join(__dirname, 'output.js.map'), sourceMap)
    }
  })
  .catch(err => console.log(err))
