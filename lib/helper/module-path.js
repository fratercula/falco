const fs = require('fs')
const path = require('path')

const { sep } = path
const pwd = __dirname.split(sep)

module.exports = function getPath(folder = pwd) {
  const nodeModulesPath = folder.concat(['node_modules']).join(sep)
  if (fs.existsSync(nodeModulesPath)) {
    return nodeModulesPath
  }
  const next = getPath(folder.slice(0, -1))
  return next || undefined
}
