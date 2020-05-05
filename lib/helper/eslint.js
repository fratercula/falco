const { join } = require('path')
const { outputFileSync, existsSync } = require('fs-extra')
const nodeModulesPath = require('./module-path')
const exec = require('./exec')
const { CWD } = require('../config')

module.exports = async () => {
  const eslintSettingsPath = join(CWD, '.vscode/settings.json')
  const eslintrcPath = join(CWD, '.eslintrc')
  const eslintrcConfig = `{
  "parser": "babel-eslint",
  "extends": "airbnb",
  "root": true,
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    "semi": [2, "never"]
  }
}`
  const [root] = await exec('npm root', ['!'])

  let eslintConfig = {}

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    eslintConfig = require(eslintSettingsPath)
  } catch (e) {
    //
  }

  eslintConfig['eslint.nodePath'] = nodeModulesPath()

  // vscode eslint config
  if (!__dirname.includes(root)) {
    outputFileSync(eslintSettingsPath, JSON.stringify(eslintConfig, null, 2))
  }

  // eslintrc
  if (!existsSync(eslintrcPath)) {
    outputFileSync(eslintrcPath, eslintrcConfig)
  }
}
