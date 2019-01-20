const { outputFileSync } = require('fs-extra')
const { resolve, join } = require('path')
const compiler = require('./compiler')
const { WORKING_DIR } = require('../config')

module.exports = async (config) => {
  const {
    entry,
  } = config
  const sources = Array.isArray(entry) ? entry : [entry]
  const baseDir = resolve(__dirname, `../${WORKING_DIR}`)
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

  try {
    await compiler(compileConfig)
  } catch (e) {
    // ignore
  }
}
