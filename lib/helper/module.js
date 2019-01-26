const regex = require('./regex')

module.exports = (code) => {
  const esModules = code.match(regex.import) || []
  const cjsModules = code.match(regex.require) || []
  const cssModules = code.match(regex['@import']) || []

  const modules = [...esModules, ...cjsModules, ...cssModules]
    .map(name => name.match(regex.package)[1])
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