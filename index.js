const webpack = require('./webpack')

const js = `import React from 'react'
import { render } from 'react-dom'

render(<div>hello world</div>, document.querySelector('#root'))`

const css = `div {
  background: red;
}`

webpack({
  entry: { js },
})
