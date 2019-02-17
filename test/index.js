const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const falco = require('../')
const { tree } = require('../')

const dir = join(__dirname, 'example')
const vueDir = join(__dirname, 'vue')
const tsDir = join(__dirname, 'ts')

const js = 'console.log(1)'
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

const treeData = tree(dir)

falco({
  // entry: {
  //   js: ts,
  //   type: 'ts', // js/jsx/ts/tsx, 'js'
  //   css: less,
  // },
  // entry: [{ js, css }],
  entry: {
    // main: 'index.js',
    // data: treeData,
    // path: dir,
    // path: vueDir,
    main: 'index.tsx',
    path: tsDir,
  },
  registry: 'https://registry.npm.taobao.org',
  externals: {
    react: ['React', 'https://unpkg.com/react@16.7.0/umd/react.production.min.js'],
    'react-dom': ['ReactDOM', 'https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js'],
    vue: ['Vue', 'https://unpkg.com/vue@2.6.6/dist/vue.min.js'],
    antd: ['antd', 'https://unpkg.com/moment@2.24.0/min/moment.min.js', 'https://unpkg.com/antd@3.13.0/dist/antd-with-locales.min.js'],
  },
  port: 8000, // 2222
  template: join(__dirname, 'template.html'),
  mode: 'development', // 'production'
  // type: 'vue', // 'react'
  // tmpDir: join(__dirname, 'temp'),
  // esModules: false, // true
  cssModule: false, // false
})
  .then(({ mode, code, sourceMap, dependencies, template }) => {
    console.log(mode, dependencies)
    if (mode === 'development') {
      return
    }

    outputFileSync(join(__dirname, 'index.html'), template)
    outputFileSync(join(__dirname, 'output.js'), code)
    if (sourceMap) {
      outputFileSync(join(__dirname, 'output.js.map'), sourceMap)
    }
  })
  .catch(err => console.log(err))
