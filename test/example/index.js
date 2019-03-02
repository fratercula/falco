import staff from './components'
import React from 'react'
import { render } from 'react-dom'
import { Button } from 'antd'

import style from './index.css'

staff()

render(<Button className={style.button} type="primary">Hello World</Button>, document.querySelector('#root'))
