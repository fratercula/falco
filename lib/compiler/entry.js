const getModules = require('../helper/module')
const dependency = require('../helper/dependency')

module.exports = (entry) => {
  const config = {
    modules: [],
  }

  let paths = []

  if (typeof entry === 'string') {
    paths = [entry]
  }

  if (Array.isArray(entry)) {
    paths = entry
  }

  if (typeof entry === 'object') {
    Object.keys(entry).forEach((key) => {
      const current = entry[key]
      if (typeof current === 'string') {
        paths.push(current)
      }
      if (Array.isArray(current)) {
        paths = current.concat(paths)
      }
    })
  }

  paths.forEach((path) => {
    try {
      const files = dependency(path)

      files.forEach(({ content }) => {
        config.modules = getModules(content).packages.concat(config.modules)
      })
    } catch (e) {
      global.console.warn('Cannot analyze entry files dependency', path)
    }
  })

  return config
}
