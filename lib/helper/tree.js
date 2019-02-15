const dirTree = require('directory-tree')
const { EXTENSIONS } = require('../config')
const reFile = require('./reFile')

module.exports = (path) => {
  const tree = dirTree(path, { extensions: EXTENSIONS })
  return reFile(tree)
}
