const { readFileSync } = require('fs-extra')
const {
  resolve,
  dirname,
  join,
  extname,
  relative,
} = require('path')
const { parseComponent } = require('vue-template-compiler')
const getModules = require('./module')
const { JS_EXTENSIONS } = require('../config')

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
    for (let i = 0; i < JS_EXTENSIONS.length; i += 1) {
      try {
        const currentExt = `.${JS_EXTENSIONS[i]}`
        const currentPath = path + currentExt
        code = readFileSync(currentPath, 'utf8')
        ext = currentExt
        path = currentPath
        if (code !== undefined) {
          break
        }
      } catch (e) {
        // ignore
      }
    }
  }

  if (code === undefined) {
    for (let i = 0; i < JS_EXTENSIONS.length; i += 1) {
      try {
        const currentExt = `.${JS_EXTENSIONS[i]}`
        const currentPath = join(path, `index${currentExt}`)
        code = readFileSync(currentPath, 'utf8')
        ext = currentExt
        path = currentPath
        if (code !== undefined) {
          break
        }
      } catch (e) {
        // ignore
      }
    }
  }

  if (code === undefined) {
    try {
      const currentPath = `${path}.vue`
      code = readFileSync(currentPath, 'utf8')
      ext = '.vue'
      path = currentPath
    } catch (e) {
      // ignore
    }
  }

  if (code === undefined) {
    throw new Error(`File path error: ${path}`)
  }

  let result = [path]
  let items = []

  if (ext === '.vue') {
    const { script, styles } = parseComponent(code)
    items = getModules(script.content + styles.map(style => style.content).join('\n')).files
  } else if (ext !== '.json' && ext !== '.svg') {
    items = getModules(code).files
  }

  items.forEach((name) => {
    result = result.concat(deps(dirname(path), name))
  })

  return result
}

module.exports = (entry, main) => {
  const files = [...new Set(deps(entry, main))]
  const isVue = files.some(file => file.includes('.vue'))

  return {
    files: files.map(path => ({
      path: relative(entry, path),
      content: readFileSync(path, 'utf8'),
    })),
    isVue,
  }
}
