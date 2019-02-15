const { readFileSync } = require('fs-extra')
const { join } = require('path')
const madge = require('madge')
const { parseComponent } = require('vue-template-compiler')

module.exports = async (entry, main) => {
  const tree = (await madge(join(entry, main))).obj()
  const files = []

  Object.keys(tree).forEach((name) => {
    if (name.includes('.vue')) {
      console.log(parseComponent(readFileSync(join(entry, name), 'utf8')))
    }

    const list = tree[name]
    if (list.length) {
      if (!files.includes(name)) {
        files.push(name)
      }
      list.forEach((item) => {
        if (!files.includes(item)) {
          files.push(item)
        }
      })
    }
  })

  return files.map(name => readFileSync(join(entry, name), 'utf8'))
}
