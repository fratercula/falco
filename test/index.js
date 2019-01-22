const falco = require('../')

// const js = `import React from 'react'
// import { render } from 'react-dom'
// render(<div>hello world</div>, document.querySelector('#root'))`

const js1 = `import two from 'two'
console.log(two())`

const js2 = 'console.log(\'?\')'

const js3 = `const two = require('two')
console.log(two())`

falco({
  entry: [{ js: js3 }],
})
  .then(res => console.log(res))
