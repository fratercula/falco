module.exports = (config) => {
  const {
    registry,
    prefix,
    modules,
    versions,
  } = config

  if (!modules.length) {
    return ''
  }

  return `npm install${registry ? ` --registry=${registry}` : ''} --no-package-lock --no-audit --prefix ${prefix} ${
    modules
      .map((name) => {
        const version = versions[name]
        if (version) {
          return `${name}@${version}`
        }
        return name
      })
      .join(' ')
  }`
}
