const logger = require('@acyort/logger')('falco')

module.exports = (config) => {
  const { registry, prefix, packages } = config
  const modules = [...new Set(config.modules)].filter(m => m)

  if (!modules.length) {
    return ''
  }

  logger.info(`installing modules: ${modules.join(', ')}`)

  return `npm install${registry ? ` --registry=${registry}` : ''} --no-package-lock --no-audit --prefix ${prefix} ${
    modules
      .map((name) => {
        const version = packages[name]
        if (version) {
          return `${name}@${version}`
        }
        return name
      })
      .join(' ')
  }`
}
