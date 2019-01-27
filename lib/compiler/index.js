const {
  outputFileSync,
  readFileSync,
  removeSync,
  existsSync,
} = require('fs-extra')
const { join } = require('path')
const logger = require('@acyort/logger')('falco')
const exec = require('../helper/exec')
const getModules = require('../helper/module')
const reFile = require('../helper/reFile')
const tree = require('../helper/tree')
const webpack = require('./webpack')
const packageJson = require('./package')
const { WORKING_DIR, BASE_DIR, EXTERNALS } = require('../config')

module.exports = (config) => {
  const {
    entry,
    output = 'output.js',
    cache = true,
    externals = {},
  } = config

  const baseDir = join(BASE_DIR, WORKING_DIR)
  const packagePath = join(baseDir, 'package.json')
  const webpackConfig = { ...config, entry: [], output }

  if (!cache) {
    removeSync(baseDir)
  }

  if (!existsSync(packagePath)) {
    outputFileSync(packagePath, packageJson)
  }
  outputFileSync(join(baseDir, 'package-lock.json'), '')

  let packages = []

  if (!entry.main) {
    const entries = Array.isArray(entry) ? entry : [entry]

    entries.forEach((source, i) => {
      const {
        js,
        css,
      } = source

      if (js) {
        outputFileSync(join(baseDir, `js${i}.js`), js)
        webpackConfig.entry.push(`js${i}.js`)
        packages = getModules(js).concat(packages)
      }
      if (css) {
        outputFileSync(join(baseDir, `css${i}.css`), css)
        webpackConfig.entry.push(`css${i}.css`)
        packages = getModules(css).concat(packages)
      }
    })
  }

  if (entry.main) {
    const treeData = tree(entry.path)
    webpackConfig.entry.push(join(treeData.name, entry.main))
    reFile(treeData, baseDir, (content) => {
      packages = getModules(content).concat(packages)
    })
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const { dependencies = {} } = require(packagePath)
  const ignorePackages = Object.keys({ ...EXTERNALS, ...externals, ...dependencies })
  const uniquePackages = [...new Set(packages)]
  const installPackages = uniquePackages.filter(name => !ignorePackages.includes(name))

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
      let sourceMap

      try {
        js = readFileSync(join(baseDir, output), 'utf8')
        sourceMap = readFileSync(join(baseDir, `${output}.map`), 'utf8')
      } catch (e) {
        // ignore
      }

      return {
        js,
        sourceMap,
        dependencies: uniquePackages
          .filter(name => Object.keys({ ...EXTERNALS, ...externals }).includes(name)),
      }
    })
}
