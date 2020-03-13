const getModules = require('../helper/module')
const dependency = require('../helper/dependency')

module.exports = (entry) => {
  const config = {
    entry: [],
    modules: [],
  };

  (Array.isArray(entry) ? entry : [entry]).forEach((path) => {
    try {
      const files = dependency(path)

      files.forEach(({ content }) => {
        config.modules = getModules(content).packages.concat(config.modules)
      })
      config.entry.push(path)
    } catch (e) {
      global.console.warn('Cannot analyze entry files dependency')
    }
  })

  return config
}
