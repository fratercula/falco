const { readFileSync, writeFileSync } = require('fs-extra')
const { join } = require('path')

function reFile(tree, base) {
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
      writeFileSync(join(base, name), content)
    } else {
      current.content = readFileSync(path, 'utf8')
    }
  }

  if (children) {
    current.children = children.map((sub) => {
      if (!base) {
        return reFile(sub)
      }
      return reFile(sub, join(base, name))
    })
  }

  return current
}

module.exports = reFile
