const { outputFileSync, readFileSync, existsSync } = require('fs-extra')
const { join } = require('path')
const logger = require('@acyort/logger')('falco')
const exec = require('../helper/exec')
const getModules = require('../helper/module')
const tree = require('../helper/tree')
const reFile = require('../helper/reFile')
const webpack = require('./webpack')
const {
  WORKING_DIR,
  BASE_DIR,
  PACKAGE,
  HTML,
} = require('../config')

module.exports = (config) => {
  const {
    entry,
    mode = 'production',
    output = 'output.js',
    externals = {},
    registry,
  } = config

  const baseDir = join(BASE_DIR, WORKING_DIR)
  const packagePath = join(baseDir, 'package.json')
  const htmlPath = join(baseDir, 'index.html')
  const webpackConfig = { ...config, entry: [], output }

  if (!existsSync(packagePath)) {
    outputFileSync(packagePath, PACKAGE)
  }

  if (!existsSync(htmlPath)) {
    outputFileSync(htmlPath, HTML)
  }

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
        webpackConfig.entry.push(join(baseDir, `js${i}.js`))
        packages = getModules(js).concat(packages)
      }
      if (css) {
        outputFileSync(join(baseDir, `css${i}.css`), css)
        webpackConfig.entry.push(join(baseDir, `css${i}.css`))
        packages = getModules(css).concat(packages)
      }
    })
  }

  if (entry.data) {
    webpackConfig.mode = 'production'
    webpackConfig.entry.push(join(baseDir, entry.data.name, entry.main))
    reFile(entry.data, baseDir, (content) => {
      packages = getModules(content).concat(packages)
    })
  }

  if (entry.path) {
    webpackConfig.entry.push(join(entry.path, entry.main))
    webpackConfig.resolveModules = true
    reFile(tree(entry.path), null, (content) => {
      packages = getModules(content).concat(packages)
    })
  }

  const ignorePackages = Object.keys(externals)
  const uniquePackages = [...new Set(packages)]
  const installPackages = uniquePackages.filter(name => !ignorePackages.includes(name))

  const commands = installPackages.length
    ? `npm install${registry ? ` --registry=${registry}` : ''} -S --no-package-lock --no-audit --prefix ${baseDir} ${installPackages.join(' ')}`
    : ''

  if (commands) {
    logger.info(`installing modules: ${installPackages.join(', ')}`)
  }

  return exec(commands, ['=npm', '~peer dependencies'])
    .then(() => webpack(webpackConfig))
    .then(() => {
      if (mode === 'development') {
        return {}
      }

      let code
      let sourceMap

      try {
        code = readFileSync(join(baseDir, output), 'utf8')
        sourceMap = readFileSync(join(baseDir, `${output}.map`), 'utf8')
      } catch (e) {
        // ignore
      }

      return {
        code,
        sourceMap,
        dependencies: uniquePackages.filter(name => Object.keys(externals).includes(name)),
      }
    })
}
