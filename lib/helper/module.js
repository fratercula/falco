const { REGEX } = require('../config')

module.exports = (content) => {
  const code = content.replace(REGEX.comments, '')
  const esModules = code.match(REGEX.import) || []
  const cjsModules = code.match(REGEX.require) || []
  const cssModules = code.match(REGEX['@import']) || []

  const modules = [...esModules, ...cjsModules, ...cssModules]
    .map(name => name.match(REGEX.package)[1])

  const packages = modules.filter(name => name.charAt(0) !== '.')
    .map((name) => {
      const names = name.split('/')
      if (!name.includes('@')) {
        return names[0]
      }
      return names.slice(0, 2).join('/')
    })

  const files = modules.filter(name => name.charAt(0) === '.')

  return {
    packages: [...new Set(packages)],
    files: [...new Set(files)],
  }
}
