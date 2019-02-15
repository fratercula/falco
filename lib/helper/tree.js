const dirTree = require('directory-tree')
const { EXTENSIONS, WORKING_DIR } = require('../config')
const reFile = require('./reFile')

module.exports = (path) => {
  const tree = dirTree(path, { extensions: EXTENSIONS, exclude: [new RegExp(`\\${WORKING_DIR}`)] })
  return reFile(tree)
}
