import React from 'react'
import { render } from 'react-dom'

import { Hello } from './hello'

console.log('?')

render(
  <Hello compiler="TypeScript" framework="React" />,
  document.getElementById('root')
)
