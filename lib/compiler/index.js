const { outputFileSync, readFileSync, existsSync } = require('fs-extra')
const { join } = require('path')
const logger = require('@acyort/logger')('falco')
const exec = require('../helper/exec')
const getModules = require('../helper/module')
const dependency = require('../helper/dependency')
const template = require('../helper/template')
const npmInstall = require('../helper/npm')
const webpack = require('./webpack')
const {
  TMP_DIR,
  PACKAGE,
  OUTPUT,
  JS_EXTENSIONS,
} = require('../config')

module.exports = async (config) => {
  const {
    entry = {},
    externals = [],
    registry,
    mode,
    cache = true,
    versions = {},
    tmpDir = TMP_DIR,
  } = config

  const webpackConfig = {
    ...config,
    entry: [],
    tmpDir,
    versions,
  }

  webpackConfig.mode = mode !== 'development' ? 'production' : 'development'

  outputFileSync(join(tmpDir, 'package.json'), PACKAGE)

  let packages = []

  if (entry.main) {
    webpackConfig.entry.push(join(entry.path, entry.main))

    const { contents, isVue } = dependency(entry.path, entry.main)

    webpackConfig.isVue = isVue
    contents.forEach((file) => {
      packages = getModules(file).packages.concat(packages)
    })
  } else {
    webpackConfig.mode = 'production';

    (Array.isArray(entry) ? entry : [entry]).forEach(({ js, css, type = 'js' }, i) => {
      const ext = JS_EXTENSIONS.includes(type) ? type : 'js'
      if (js) {
        outputFileSync(join(tmpDir, `js${i}.${ext}`), js)
        webpackConfig.entry.push(join(tmpDir, `js${i}.${ext}`))
        packages = getModules(js).packages.concat(packages)
      }
      if (css) {
        outputFileSync(join(tmpDir, `css${i}.css`), css)
        webpackConfig.entry.push(join(tmpDir, `css${i}.css`))
        packages = getModules(css).packages.concat(packages)
      }
    })
  }

  const ignorePackages = externals.map(({ name }) => name)
  const uniquePackages = [...new Set(packages)]
  const installPackages = uniquePackages.filter(name => !ignorePackages.includes(name))
  const dependencies = uniquePackages.filter(name => ignorePackages.includes(name))

  const commands = npmInstall({
    registry,
    prefix: tmpDir,
    modules: installPackages,
    versions,
  })

  if (commands) {
    logger.info(`installing modules: ${installPackages.join(', ')}`)
  }

  if (cache === false) {
    const nodeModulesPath = join(tmpDir, 'node_modules')
    if (existsSync(nodeModulesPath)) {
      await exec(`rm -rf ${join(tmpDir, 'node_modules')}`)
    }
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
