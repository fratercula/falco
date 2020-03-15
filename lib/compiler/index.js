const { outputFileSync, readFileSync } = require('fs-extra')
const { join } = require('path')
const exec = require('../helper/exec')
const getTemplate = require('./template')
const npmInstall = require('../helper/npm')
const webpack = require('./webpack')
const getEntry = require('./entry')
const getRequires = require('./requires')
const getDefaults = require('./defaults')
const { PACKAGE } = require('../config')

module.exports = async (params = {}) => {
  const config = getDefaults(params)
  const { npm, tmpDir, packages } = config
  const webpackConfig = { ...config, ...getEntry(config.entry) }
  const { installs, dependencies } = getRequires(webpackConfig)

  outputFileSync(join(tmpDir, 'package.json'), PACKAGE)

  const commands = npmInstall({
    npm,
    prefix: tmpDir,
    modules: installs.concat(Object.keys(packages)),
    packages,
  })
  await exec(commands, ['=npm', '=npm WARN', '~peer dependencies'])

  const { assets, server, mode } = await webpack(webpackConfig)

  const template = getTemplate(
    webpackConfig,
    dependencies,
    assets || [{ name: 'main.js' }],
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
