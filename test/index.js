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
  externals: { antd: 'antd' },
  cache: true,
  esmodules: true,
  compress: true,
  cssModule: false,
  cssSourceMap: false,
  jsSourceMap: false,
})
  .then(({ js, sourceMap, dependencies }) => {
    console.log(dependencies)
    outputFileSync(join(__dirname, 'output.js'), js)
  })
  .catch(err => console.log(err))
