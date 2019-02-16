const dirTree = require('directory-tree')
const { EXTENSIONS, CACHE_FOLDER } = require('../config')
const reFile = require('./reFile')

module.exports = (path) => {
  const tree = dirTree(path, {
    extensions: EXTENSIONS,
    exclude: [
      new RegExp(`\\${CACHE_FOLDER}`),
      /node_modules/,
      /(^|[/\\])\../,
      /package.*\.json/,
    ],
  })
  return reFile(tree)
}
