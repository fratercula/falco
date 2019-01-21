const { outputFileSync, readFileSync, removeSync } = require('fs-extra')
const { join } = require('path')
const regex = require('../helper/regex')
const exec = require('../helper/exec')
const compiler = require('./compiler')
const packageJson = require('./package')
const { WORKING_DIR, BASE_DIR } = require('../config')

module.exports = (config) => {
  const {
    entry,
    sourceMap,
  } = config

  const sources = Array.isArray(entry) ? entry : [entry]
  const baseDir = join(BASE_DIR, WORKING_DIR)

  const packages = []
  const compileConfig = {
    entry: [],
    sourceMap,
  }

  removeSync(baseDir)
  outputFileSync(join(baseDir, 'package.json'), packageJson)
  outputFileSync(join(baseDir, 'package-lock.json'), '')

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

    const matchs = js.match(regex.import) || []

    matchs.forEach((s) => {
      packages.push(s.match(regex.package)[1])
    })
  })

  return exec(`npm install --prefix ${baseDir} ${packages.join(' ')}`)
    .then(() => compiler(compileConfig))
    .then(() => {
      let js
      let map

      try {
        js = readFileSync(join(baseDir, 'output.js'), 'utf8')
        map = readFileSync(join(baseDir, 'output.js.map'), 'utf8')
      } catch (e) {
        // ignore
      }

      if (map) {
        return [js, map]
      }
      return [js]
    })
}
