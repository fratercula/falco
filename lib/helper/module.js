const { REGEX } = require('../config')

module.exports = (code) => {
  const esModules = code.match(REGEX.import) || []
  const cjsModules = code.match(REGEX.require) || []
  const cssModules = code.match(REGEX['@import']) || []

  const modules = [...esModules, ...cjsModules, ...cssModules]
    .map(name => name.match(REGEX.package)[1])
    .filter(name => name.charAt(0) !== '.')
    .map((name) => {
      const names = name.split('/')
      if (!name.includes('@')) {
        return names[0]
      }
      return names.slice(0, 2).join('/')
    })

  return [...new Set(modules)]
}
