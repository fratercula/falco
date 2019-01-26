const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const falco = require('../')
const { tree } = require('../')
const reFile = require('../lib/helper/reFile')

const js = `import React from 'react'
import { render } from 'react-dom'
import 'reset-css'
render(<div>hello world</div>, document.querySelector('#root'))`

// const js1 = `import two from 'two'
// console.log(two())`

// const js2 = 'console.log(\'?\')'

// const js3 = `const two = require('two')
// console.log(two())`

// const js4 = `import 'reset-css'`

const dir = join(__dirname, 'example')
const dataTree = tree(dir)

falco({
  entry: {
    // type: 'string',
    type: 'tree',
    main: 'index.js',
    data: dataTree,
    // data: { js },
  },
  cache: true,
  compress: true,
  cssModule: false,
  cssSourceMap: false,
  jsSourceMap: false,
})
  .then(res => outputFileSync(join(__dirname, 'output.js'), res.js))
