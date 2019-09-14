const { join } = require('path')
const { outputFileSync, existsSync } = require('fs-extra')
const nodeModulesPath = require('./module-path')

module.exports = () => {
  const cwd = process.cwd()
  const eslintSettingsPath = join(cwd, '.vscode/settings.json')
  const eslintrcPath = join(cwd, '.eslintrc')
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

  let eslintConfig = {}

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    eslintConfig = require(eslintSettingsPath)
  } catch (e) {
    //
  }

  eslintConfig['eslint.nodePath'] = nodeModulesPath()

  // vscode eslint config
  outputFileSync(eslintSettingsPath, JSON.stringify(eslintConfig, null, 2))

  // eslintrc
  if (!existsSync(eslintrcPath)) {
    outputFileSync(eslintrcPath, eslintrcConfig)
  }
}
