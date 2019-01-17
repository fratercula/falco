import React from 'react'
import { render } from 'react-dom'
import css from './test.css'

render(<div className={css.div}>hello world</div>, document.querySelector('#root'))
