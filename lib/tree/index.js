const dirTree = require('directory-tree')
const { extensions } = require('../config')
const reFile = require('../helper/reFile')

module.exports = (path) => {
  const tree = dirTree(path, { extensions })
  return reFile(tree)
}
