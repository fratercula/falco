const { readFileSync } = require('fs-extra')
const { resolve, dirname, extname } = require('path')
const { parseComponent } = require('vue-template-compiler')
const getModules = require('./module')

const deps = (entry, main) => {
  const path = resolve(entry, main)
  const ext = extname(path)
  const code = readFileSync(path, 'utf8')

  let result = [path]
  let items = []

  if (ext === '.vue') {
    const { script, styles } = parseComponent(code)
    items = getModules(script.content + styles.map(style => style.content).join('\n')).files
  } else if (ext !== 'json') {
    items = getModules(code).files
  }

  items.forEach((name) => {
    result = result.concat(deps(dirname(path), name))
  })

  return result
}

module.exports = (entry, main) => [...new Set(deps(entry, main))]
  .map(path => readFileSync(path, 'utf8'))
