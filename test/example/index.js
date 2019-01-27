import staff from './components'
import React from 'react'
import { render } from 'react-dom'
import { Button } from 'antd'
import 'reset-css/less/reset.less'

staff()

render(<Button type="primary">Hello World</Button>, document.querySelector('#root'))
