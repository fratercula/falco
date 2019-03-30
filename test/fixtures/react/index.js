import React from 'react'
import { render } from 'react-dom'
import Com from './components'
import style from './index.css'

render(
  <div className={style.button}>
    <Com />
  </div>,
  document.querySelector('#root')
)
