const dirTree = require('directory-tree')
const { extensions } = require('../config')
const reFile = require('../helper/reFile')

module.exports = (path) => {
  const tree = dirTree(path, { extensions })
  const dataTree = reFile(tree)
  console.log(JSON.stringify(dataTree))
}
