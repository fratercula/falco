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
    type,
    name,
  }

  if (type === 'file') {
    if (base) {
      outputFileSync(join(base, name), content)
      callback(content)
    } else {
      current.content = readFileSync(path, 'utf8')
    }
  }

  if (children) {
    current.children = children.map((sub) => {
      if (!base) {
        return reFile(sub)
      }
      return reFile(sub, join(base, name), callback)
    })
  }

  return current
}

module.exports = reFile
