const external = require('./external')

module.exports = (config, dependencies) => {
  const { externals } = config
  const exts = {}
  dependencies.forEach((name) => {
    exts[name] = externals[name]
  })
  const { html } = external(exts, config)
  return html
}
