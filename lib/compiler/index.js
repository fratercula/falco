const { outputFileSync, readFileSync, existsSync } = require('fs-extra')
const { join } = require('path')
const logger = require('@acyort/logger')('falco')
const exec = require('../helper/exec')
const getModules = require('../helper/module')
const reFile = require('../helper/reFile')
const dependency = require('../helper/dependency')
const external = require('../helper/external')
const template = require('../helper/template')
const webpack = require('./webpack')
const {
  WORKING_DIR,
  BASE_DIR,
  PACKAGE,
  OUTPUT,
} = require('../config')

module.exports = async (config) => {
  const {
    entry,
    mode = 'production',
    externals = {},
    registry,
    unpkg,
  } = config

  const baseDir = join(BASE_DIR, WORKING_DIR)
  const webpackConfig = { ...config, entry: [] }
  const { html } = external(externals, unpkg)

  outputFileSync(join(baseDir, 'package.json'), PACKAGE)
  outputFileSync(join(baseDir, 'index.html'), html)

  let packages = []

  if (!entry.main) {
    webpackConfig.mode = 'production'

    const entries = Array.isArray(entry) ? entry : [entry]
    entries.forEach(({ js, css }, i) => {
      if (js) {
        outputFileSync(join(baseDir, `js${i}.js`), js)
        webpackConfig.entry.push(join(baseDir, `js${i}.js`))
        packages = getModules(js).packages.concat(packages)
      }
      if (css) {
        outputFileSync(join(baseDir, `css${i}.css`), css)
        webpackConfig.entry.push(join(baseDir, `css${i}.css`))
        packages = getModules(css).packages.concat(packages)
      }
    })
  }

  if (entry.data) {
    webpackConfig.mode = 'production'
    webpackConfig.entry.push(join(baseDir, entry.data.name, entry.main))

    reFile(entry.data, baseDir)

    dependency(join(baseDir, entry.data.name), entry.main).forEach((file) => {
      packages = getModules(file).packages.concat(packages)
    })
  }

  if (entry.path) {
    if (!existsSync(join(entry.path, entry.main))) {
      return Promise.reject(new Error('not build entry file'))
    }

    webpackConfig.entry.push(join(entry.path, entry.main))
    webpackConfig.resolveModules = true

    dependency(entry.path, entry.main).forEach((file) => {
      packages = getModules(file).packages.concat(packages)
    })
  }

  const ignorePackages = Object.keys(externals)
  const uniquePackages = [...new Set(packages)]
  const installPackages = uniquePackages.filter(name => !ignorePackages.includes(name))
  const dependencies = uniquePackages.filter(name => Object.keys(externals).includes(name))

  const commands = installPackages.length
    ? `npm install${registry ? ` --registry=${registry}` : ''} --no-package-lock --no-audit --prefix ${baseDir} ${installPackages.join(' ')}`
    : ''

  if (commands) {
    logger.info(`installing modules: ${installPackages.join(', ')}`)
  }

  await exec(commands, ['=npm', '~peer dependencies'])
  await webpack(webpackConfig)

  if (mode === 'development') {
    return {}
  }

  let code
  let sourceMap

  try {
    code = readFileSync(join(baseDir, OUTPUT), 'utf8')
    sourceMap = readFileSync(join(baseDir, `${OUTPUT}.map`), 'utf8')
  } catch (e) {
    // ignore
  }

  return {
    mode,
    code,
    sourceMap,
    dependencies,
    template: template(externals, dependencies, unpkg),
  }
}
