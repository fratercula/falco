const { readFileSync, outputFileSync } = require('fs-extra')
const { join } = require('path')

function reFile(tree, base, callback) {
  const {
    type,
    children,
    name,
    path,
    content,
  } = tree
  const current = {
    path,
    type,
    name,
  }

  if (type === 'file') {
    if (base) {
      outputFileSync(join(base, name), content)
    } else {
      current.content = readFileSync(path, 'utf8')
    }
    if (callback) {
      callback(content || current.content)
    }
  }

  if (children) {
    current.children = children.map((sub) => {
      if (!base) {
        return reFile(sub, null, callback)
      }
      return reFile(sub, join(base, name), callback)
    })
  }

  return current
}

module.exports = reFile
