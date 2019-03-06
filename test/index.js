const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const falco = require('../')

const dir = join(__dirname, 'example')
const vueDir = join(__dirname, 'vue')
const tsDir = join(__dirname, 'ts')

const js = `
import five from 'five'
class A {
  state = 1

  log() {
    console.log(this.state)
  }
}

new A().log()

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x); // 1
console.log(y); // 2
console.log(z); // { a: 3, b: 4 }

function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}

console.log(MyTestableClass.isTestable) // true

;(async () => {
  await console.log(1)
  console.log(2)
})()
`
const css = 'body { background: grey; }'
const ts = 'const x: number = 0; console.log(x)'
const less = `@width: 10px;
@height: @width + 10px;

body {
  background: red;
  width: @width;
  height: @height;
}
`

const umd = `
import React from 'react'
import ReactDOM from 'react-dom'
export default function () {
  return (<div></div>)
}
`

falco({
  // entry: {
  //   js: ts,
  //   type: 'ts', // js/jsx/ts/tsx, 'js'
  //   css: less,
  // },
  // entry: {
  //   main: 'index.js',
  //   // main: 'index.tsx',

  //   path: dir,
  //   // path: vueDir,
  //   // path: tsDir,
  // },
  // entry: [{ js, css }],
  entry: { js: umd },
  output: {
    filename: 'build.[hash:8].js',
    library: 'Ta',
    libraryTarget: 'umd'
  }, // {}
  registry: 'https://registry.npm.taobao.org',
  externals: [
    {
      name: 'react',
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      urls: 'https://unpkg.com/react@16.7.0/umd/react.production.min.js',
    },
    {
      name: 'react-dom',
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      urls: 'https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js',
    },
    {
      name: 'vue',
      root: 'Vue',
    },
    {
      name: 'antd',
      root: 'antd',
      urls: ['https://unpkg.com/moment@2.24.0/min/moment.min.js', 'https://unpkg.com/antd@3.13.0/dist/antd-with-locales.min.js'],
    },
  ],
  packages: {
    // five: '*',
  },
  cache: false, // true
  // port: 8000, // 2222
  template: join(__dirname, 'template.html'),
  mode: 'development', // 'production'
  tmpDir: join(__dirname, 'temp'),
  // esModules: false, // true
  cssModule: false, // false
})
  .then(({ mode, codes, dependencies, template }) => {
    console.log(mode, dependencies)

    if (mode === 'development') {
      return
    }

    outputFileSync(join(__dirname, 'index.html'), template)

    codes.forEach(({ name, content }) => {
      outputFileSync(join(__dirname, name), content)
    })
  })
  .catch(err => console.log(err))
