const { join } = require('path')
const { CWD } = require('../config')

module.exports = (config) => {
  const { mode, modules, externals } = config
  const ignores = externals.map(({ name }) => name)
  const installs = []
  const dependencies = modules.length && mode === 'production'
    ? modules.filter((name) => ignores.includes(name))
    : ignores

  modules
    .filter((name) => !ignores.includes(name))
    .forEach((name) => {
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        require(join(CWD, 'node_modules', name))
      } catch (e) {
        installs.push(name)
      }
    })

  return { installs, dependencies: [...new Set(dependencies)] }
}
