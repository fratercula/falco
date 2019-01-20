const falco = require('../index')

const js = `import React from 'react'
import { render } from 'react-dom'
render(<div>hello world</div>, document.querySelector('#root'))`

falco({ entry: { js } })
  .then(res => console.log(res))
