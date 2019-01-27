const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const falco = require('../')

const dir = join(__dirname, 'example')
const js = 'console.log(1)'
const css = 'body { background: grey; }'

falco({
  // entry: { js, css },
  // entry: [{ js, css }],
  entry: {
    main: 'index.js',
    path: dir,
  },
  moduleRules: [],
  externals: { antd: 'antd' },
  cache: true, // true
  esModules: true, // true
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
