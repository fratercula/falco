const external = require('./external')

module.exports = (externals, dependencies, unpkg) => {
  const exts = {}
  dependencies.forEach((name) => {
    exts[name] = externals[name]
  })
  const { html } = external(exts, unpkg)
  return html
}
