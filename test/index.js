const falco = require('../')

// const js = `import React from 'react'
// import { render } from 'react-dom'
// render(<div>hello world</div>, document.querySelector('#root'))`

const js1 = `import two from 'two'
console.log(two())`

falco({
  entry: [{ js: js1 }],
})
  .then(res => console.log(res))
