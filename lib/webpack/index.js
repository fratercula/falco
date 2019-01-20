const { outputFileSync, readFileSync } = require('fs-extra')
const { resolve, join } = require('path')
const compiler = require('./compiler')
const { WORKING_DIR } = require('../config')

module.exports = (config) => {
  const {
    entry,
  } = config
  const sources = Array.isArray(entry) ? entry : [entry]
  const baseDir = resolve(__dirname, `../../${WORKING_DIR}`)
  const compileConfig = { entry: [] }

  sources.forEach((source, i) => {
    const {
      js,
      css,
    } = source

    if (js) {
      outputFileSync(join(baseDir, `js${i}.js`), js)
      compileConfig.entry.push(`js${i}.js`)
    }
    if (css) {
      outputFileSync(join(baseDir, `css${i}.css`), css)
      compileConfig.entry.push(`css${i}.css`)
    }
  })

  return compiler(compileConfig).then(() => {
    let js
    let map

    try {
      js = readFileSync(join(baseDir, 'output.js'), 'utf8')
      map = readFileSync(join(baseDir, 'output.js.map'), 'utf8')
    } catch (e) {
      // ignore
    }

    return [js, map]
  })
}
