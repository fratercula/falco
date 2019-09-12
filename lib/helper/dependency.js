const { readFileSync } = require('fs-extra')
const {
  resolve,
  dirname,
  join,
  extname,
  basename,
  relative,
} = require('path')
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
      } catch (e) {
        // ignore
      }
    }
  }

  if (code === undefined) {
    throw new Error(`File path error: ${path}`)
  }

  let result = [path]
  let items = []

  if (ext !== '.json' && ext !== '.svg') {
    items = getModules(code).files
  }

  items.forEach((name) => {
    result = result.concat(deps(dirname(path), name))
  })

  return result
}

module.exports = (entry) => {
  const base = dirname(entry)
  const files = [...new Set(deps(dirname(entry), basename(entry)))]

  return files.map((path) => ({
    path: relative(base, path),
    content: readFileSync(path, 'utf8'),
  }))
}
