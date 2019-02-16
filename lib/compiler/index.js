const { outputFileSync, readFileSync } = require('fs-extra')
const { join } = require('path')
const logger = require('@acyort/logger')('falco')
const exec = require('../helper/exec')
const getModules = require('../helper/module')
const reFile = require('../helper/reFile')
const dependency = require('../helper/dependency')
const template = require('../helper/template')
const webpack = require('./webpack')
const { BASE_DIR, PACKAGE, OUTPUT } = require('../config')

module.exports = async (config) => {
  const {
    entry = {},
    externals = {},
    registry,
    mode,
    template: templatePath,
  } = config

  const webpackConfig = { ...config, entry: [] }

  webpackConfig.mode = mode !== 'development' ? 'production' : 'development'

  outputFileSync(join(BASE_DIR, 'package.json'), PACKAGE)

  let packages = []

  if (entry.main) {
    if (entry.data) {
      webpackConfig.mode = 'production'
      webpackConfig.entry.push(join(BASE_DIR, entry.data.name, entry.main))

      reFile(entry.data, BASE_DIR)

      dependency(join(BASE_DIR, entry.data.name), entry.main).forEach((file) => {
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
        outputFileSync(join(BASE_DIR, `js${i}.js`), js)
        webpackConfig.entry.push(join(BASE_DIR, `js${i}.js`))
        packages = getModules(js).packages.concat(packages)
      }
      if (css) {
        outputFileSync(join(BASE_DIR, `css${i}.css`), css)
        webpackConfig.entry.push(join(BASE_DIR, `css${i}.css`))
        packages = getModules(css).packages.concat(packages)
      }
    })
  }

  const ignorePackages = Object.keys(externals)
  const uniquePackages = [...new Set(packages)]
  const installPackages = uniquePackages.filter(name => !ignorePackages.includes(name))
  const dependencies = uniquePackages.filter(name => Object.keys(externals).includes(name))

  const commands = installPackages.length
    ? `npm install${registry ? ` --registry=${registry}` : ''} --no-package-lock --no-audit --prefix ${BASE_DIR} ${installPackages.join(' ')}`
    : ''

  if (commands) {
    logger.info(`installing modules: ${installPackages.join(', ')}`)
  }

  await exec(commands, ['=npm', '~peer dependencies'])
  await webpack(webpackConfig)

  let code
  let sourceMap
  let templateData

  if (webpackConfig.mode === 'production') {
    try {
      code = readFileSync(join(BASE_DIR, OUTPUT), 'utf8')
      sourceMap = readFileSync(join(BASE_DIR, `${OUTPUT}.map`), 'utf8')
    } catch (e) {
      // ignore
    }
  }

  try {
    templateData = readFileSync(templatePath, 'utf8')
  } catch (e) {
    // ignore
  }

  templateData = template(externals, dependencies, templateData)
  outputFileSync(join(BASE_DIR, 'index.html'), templateData)

  return {
    mode: webpackConfig.mode,
    code,
    sourceMap,
    dependencies,
    template: templateData,
  }
}
