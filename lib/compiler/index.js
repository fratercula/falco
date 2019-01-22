const { outputFileSync, readFileSync, removeSync } = require('fs-extra')
const { join } = require('path')
const logger = require('@acyort/logger')('falco')
const regex = require('../helper/regex')
const exec = require('../helper/exec')
const webpack = require('./webpack')
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
  const webpackConfig = {
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
      webpackConfig.entry.push(`js${i}.js`)
    }
    if (css) {
      outputFileSync(join(baseDir, `css${i}.css`), css)
      webpackConfig.entry.push(`css${i}.css`)
    }

    const ejs = js.match(regex.import) || []
    const cjs = js.match(regex.require) || []

    ejs.concat(cjs).forEach((s) => {
      packages.push(s.match(regex.package)[1])
    })
  })

  const commands = packages.length
    ? `npm install --prefix ${baseDir} ${packages.join(' ')}`
    : ''

  if (commands) {
    logger.info('install modules...')
  }

  return exec(commands)
    .then(() => webpack(webpackConfig))
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
