const {
  outputFileSync,
  readFileSync,
  removeSync,
  existsSync,
} = require('fs-extra')
const { join } = require('path')
const logger = require('@acyort/logger')('falco')
const regex = require('../helper/regex')
const exec = require('../helper/exec')
const webpack = require('./webpack')
const packageJson = require('./package')
const { WORKING_DIR, BASE_DIR, EXTERNALS } = require('../config')

module.exports = (config) => {
  const {
    entry,
    cache = true,
    externals = {},
  } = config

  const entries = Array.isArray(entry) ? entry : [entry]
  const baseDir = join(BASE_DIR, WORKING_DIR)
  const packagePath = join(baseDir, 'package.json')

  const packages = []
  const webpackConfig = { ...config, entry: [] }

  if (!cache) {
    removeSync(baseDir)
  }

  if (!existsSync(packagePath)) {
    outputFileSync(packagePath, packageJson)
  }
  outputFileSync(join(baseDir, 'package-lock.json'), '')

  entries.forEach((source, i) => {
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

    const esModules = js.match(regex.import) || []
    const cjsModules = js.match(regex.require) || []

    esModules.concat(cjsModules).forEach((s) => {
      packages.push(s.match(regex.package)[1].split('/')[0])
    })
  })

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const { dependencies = {} } = require(packagePath)
  const ignorePackages = Object.keys({ ...EXTERNALS, ...externals, ...dependencies })
  const installPackages = packages.filter(name => !ignorePackages.includes(name))

  const commands = installPackages.length
    ? `npm install --prefix ${baseDir} ${installPackages.join(' ')}`
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
    .catch(err => logger.error(err || 'build error'))
}
