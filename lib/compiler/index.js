const { outputFileSync, readFileSync, existsSync } = require('fs-extra')
const { join } = require('path')
const logger = require('@acyort/logger')('falco')
const exec = require('../helper/exec')
const template = require('../helper/template')
const npmInstall = require('../helper/npm')
const webpack = require('./webpack')
const getEntry = require('./entry')
const { TMP_DIR, PACKAGE, OUTPUT } = require('../config')

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
    tmpDir,
    versions,
    mode: mode === 'development' ? 'development' : 'production',
    ...getEntry(entry, tmpDir),
  }

  const { packages } = webpackConfig
  const ignorePackages = externals.map(({ name }) => name)
  const installPackages = packages.filter(name => !ignorePackages.includes(name))
  const dependencies = packages.filter(name => ignorePackages.includes(name))
  const templateData = template(webpackConfig, dependencies)

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

  outputFileSync(join(tmpDir, 'package.json'), PACKAGE)

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

  outputFileSync(join(tmpDir, 'index.html'), templateData)

  return {
    mode: webpackConfig.mode,
    code,
    sourceMap,
    dependencies,
    template: templateData,
  }
}
