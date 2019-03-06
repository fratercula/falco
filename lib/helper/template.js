const external = require('./external')

module.exports = (config, dependencies, assets) => {
  const { externals = [] } = config
  const exts = externals.filter(({ name }) => dependencies.includes(name))
  const { html } = external(exts, config, assets)
  return html
}
