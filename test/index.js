const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const falco = require('../')
const { tree } = require('../')

const dir = join(__dirname, 'example')
const dataTree = tree(dir)

falco({
  entry: {
    // type: 'string',
    // data: { js },
    type: 'tree',
    main: 'index.js',
    data: dataTree,
  },
  moduleRules: [],
  output: 'output', // 'output'
  externals: { antd: 'antd' },
  cache: true, // true
  esmodules: true, // true
  compress: true, // true
  cssModule: true, // false
  cssSourceMap: true, // false
  jsSourceMap: true, // false
})
  .then(({ js, sourceMap, dependencies }) => {
    console.log(dependencies)
    outputFileSync(join(__dirname, 'output.js'), js)
    if (sourceMap) {
      outputFileSync(join(__dirname, 'output.js.map'), sourceMap)
    }
  })
  .catch(err => console.log(err))
