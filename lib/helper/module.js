const { REGEX, EXCLUDE_MODULES } = require('../config')
const packageName = require('./name')

module.exports = (content) => {
  const code = content.replace(REGEX.comments, '')
  const esModules = code.match(REGEX.import) || []
  const cjsModules = code.match(REGEX.require) || []
  const cssModules = code.match(REGEX['@import']) || []
  const modules = [];

  [...esModules, ...cjsModules, ...cssModules].forEach((name) => {
    const matched = name.match(REGEX.package)
    if (matched) {
      modules.push(matched[1])
    }
  })

  const packages = modules
    .filter((name) => name.charAt(0) !== '.' && !EXCLUDE_MODULES.includes(name))
    .map((name) => packageName(name))

  const files = modules.filter((name) => name.charAt(0) === '.')

  return {
    packages: [...new Set(packages)],
    files: [...new Set(files)],
  }
}
