import staff from './components'
import React from 'react'
import { render } from 'react-dom'
import { Button } from 'antd'

import style from './index.css'

import five from 'five'

console.log(five())

staff()

console.log('react')
render(<Button className={style.button} type="primary">Hello World</Button>, document.querySelector('#root'))
