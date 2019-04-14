const { outputFileSync, readFileSync } = require('fs-extra')
const { join } = require('path')
const exec = require('../helper/exec')
const template = require('../helper/template')
const npmInstall = require('../helper/npm')
const webpack = require('./webpack')
const getEntry = require('./entry')
const { TMP_DIR, PACKAGE } = require('../config')

module.exports = async (config = {}) => {
  const {
    entry = {},
    externals = [],
    mode,
    packages = {},
    npm = {},
    tmpDir = TMP_DIR,
  } = config

  const [root] = await exec('npm root', ['!'])

  const webpackConfig = {
    ...config,
    tmpDir,
    packages,
    npm,
    npmRoot: root,
    installEnv: __dirname.includes(root) ? 'local' : 'global',
    mode: mode === 'development' ? 'development' : 'production',
    ...getEntry(entry, tmpDir),
  }

  const ignorePackages = externals.map(({ name }) => name)
  const { modules } = webpackConfig
  const installPackages = modules.filter(name => !ignorePackages.includes(name))
  const dependencies = modules.length
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
  const { assets, server } = await webpack(webpackConfig)

  const templateData = template(webpackConfig, dependencies, assets)

  outputFileSync(join(tmpDir, 'index.html'), templateData)

  return {
    mode: webpackConfig.mode,
    codes: assets
      ? assets.map(({ name }) => ({ name, content: readFileSync(join(tmpDir, name), 'utf8') }))
      : [],
    dependencies,
    template: templateData,
    server,
  }
}
