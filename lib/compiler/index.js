const { outputFileSync, readFileSync } = require('fs-extra')
const { join } = require('path')
const logger = require('@acyort/logger')('falco')
const exec = require('../helper/exec')
const getModules = require('../helper/module')
const reFile = require('../helper/reFile')
const dependency = require('../helper/dependency')
const template = require('../helper/template')
const webpack = require('./webpack')
const { TMP_DIR, PACKAGE, OUTPUT } = require('../config')

module.exports = async (config) => {
  const {
    entry = {},
    externals = {},
    registry,
    mode,
    tmpDir = TMP_DIR,
  } = config

  const webpackConfig = { ...config, entry: [], tmpDir }

  webpackConfig.mode = mode !== 'development' ? 'production' : 'development'

  outputFileSync(join(tmpDir, 'package.json'), PACKAGE)

  let packages = []

  if (entry.main) {
    if (entry.data) {
      webpackConfig.mode = 'production'
      webpackConfig.entry.push(join(tmpDir, entry.data.name, entry.main))

      reFile(entry.data, tmpDir)

      dependency(join(tmpDir, entry.data.name), entry.main).forEach((file) => {
        packages = getModules(file).packages.concat(packages)
      })
    } else if (entry.path) {
      webpackConfig.entry.push(join(entry.path, entry.main))
      webpackConfig.resolveModules = true

      dependency(entry.path, entry.main).forEach((file) => {
        packages = getModules(file).packages.concat(packages)
      })
    }
  } else {
    webpackConfig.mode = 'production';

    (Array.isArray(entry) ? entry : [entry]).forEach(({ js, css }, i) => {
      if (js) {
        outputFileSync(join(tmpDir, `js${i}.js`), js)
        webpackConfig.entry.push(join(tmpDir, `js${i}.js`))
        packages = getModules(js).packages.concat(packages)
      }
      if (css) {
        outputFileSync(join(tmpDir, `css${i}.css`), css)
        webpackConfig.entry.push(join(tmpDir, `css${i}.css`))
        packages = getModules(css).packages.concat(packages)
      }
    })
  }

  const ignorePackages = Object.keys(externals)
  const uniquePackages = [...new Set(packages)]
  const installPackages = uniquePackages.filter(name => !ignorePackages.includes(name))
  const dependencies = uniquePackages.filter(name => Object.keys(externals).includes(name))

  const commands = installPackages.length
    ? `npm install${registry ? ` --registry=${registry}` : ''} --no-package-lock --no-audit --prefix ${tmpDir} ${installPackages.join(' ')}`
    : ''

  if (commands) {
    logger.info(`installing modules: ${installPackages.join(', ')}`)
  }

  await exec(commands, ['=npm', '~peer dependencies'])
  await webpack(webpackConfig)

  let code
  let sourceMap

  if (webpackConfig.mode === 'production') {
    try {
      code = readFileSync(join(tmpDir, OUTPUT), 'utf8')
      sourceMap = readFileSync(join(tmpDir, `${OUTPUT}.map`), 'utf8')
    } catch (e) {
      // ignore
    }
  }

  const templateData = template(webpackConfig, dependencies)
  outputFileSync(join(tmpDir, 'index.html'), templateData)

  return {
    mode: webpackConfig.mode,
    code,
    sourceMap,
    dependencies,
    template: templateData,
  }
}
