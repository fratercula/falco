const { readFileSync } = require('fs-extra')
const {
  resolve,
  dirname,
  extname,
  join,
} = require('path')
const { parseComponent } = require('vue-template-compiler')
const getModules = require('./module')

const deps = (entry, main) => {
  let path = resolve(entry, main)
  let ext = extname(path)
  let code

  try {
    code = readFileSync(path, 'utf8')
  } catch (e) {
    // ignore
  }

  if (code === undefined) {
    try {
      code = readFileSync(`${path}.js`, 'utf8')
    } catch (e) {
      // ignore
    }
  }

  if (code === undefined) {
    try {
      const current = join(path, 'index.js')
      code = readFileSync(current, 'utf8')
      path = current
    } catch (e) {
      // ignore
    }
  }

  if (code === undefined) {
    try {
      code = readFileSync(`${path}.vue`, 'utf8')
      ext = '.vue'
    } catch (e) {
      // ignore
    }
  }

  code = code || ''

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
