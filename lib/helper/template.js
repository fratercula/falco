const external = require('./external')

module.exports = (externals, dependencies, template) => {
  const exts = {}
  dependencies.forEach((name) => {
    exts[name] = externals[name]
  })
  const { html } = external(exts, template)
  return html
}
