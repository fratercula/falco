const { outputFileSync, readFileSync } = require('fs-extra')
const { join } = require('path')
const exec = require('../helper/exec')
const getTemplate = require('./template')
const npmInstall = require('../helper/npm')
const webpack = require('./webpack')
const getEntry = require('./entry')
const { TMP_DIR, PACKAGE } = require('../config')

module.exports = async (config = {}) => {
  const {
    entry = {},
    externals = [],
    packages = {},
    npm = {},
    esModules = true,
    tmpDir = TMP_DIR,
  } = config

  const webpackConfig = {
    ...config,
    externals,
    tmpDir,
    packages,
    npm,
    esModules,
    ...getEntry(entry, tmpDir),
  }

  const ignorePackages = externals.map(({ name }) => name)
  const { modules } = webpackConfig
  const installPackages = modules.filter(name => !ignorePackages.includes(name))
  const dependencies = modules.length && webpackConfig.mode === 'production'
    ? modules.filter(name => ignorePackages.includes(name))
    : ignorePackages

  const commands = npmInstall({
    npm,
    prefix: tmpDir,
    modules: installPackages.concat(Object.keys(packages)),
    packages,
  })

  outputFileSync(join(tmpDir, 'package.json'), PACKAGE)

  await exec(commands, ['=npm', '=npm WARN', '~peer dependencies'])
  const { assets, server, mode } = await webpack(webpackConfig)

  const template = getTemplate(
    webpackConfig,
    dependencies,
    assets || [{ name: 'index.js' }],
  )

  outputFileSync(join(tmpDir, 'index.html'), template)

  return {
    mode,
    codes: assets
      ? assets.map(({ name }) => ({ name, content: readFileSync(join(tmpDir, name), 'utf8') }))
      : [],
    dependencies,
    template,
    server,
  }
}
