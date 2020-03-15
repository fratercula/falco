const {
  extname,
  basename,
  dirname,
  join,
} = require('path')
const getModules = require('../helper/module')
const dependency = require('../helper/dependency')
const { JS_EXTENSIONS, FILE_TAG } = require('../config')

module.exports = (entry) => {
  const widthPolyfillPath = (path) => {
    const p = dirname(path)
    const n = basename(path)
    return join(p, `${FILE_TAG}${n}`)
  }
  const isJs = (path) => {
    const ext = extname(path).slice(1)
    return JS_EXTENSIONS.includes(ext)
  }

  let modules = []

  let widthPolyfillEntry = []
  let widthPolyfillEntrys = []
  let entrys = []

  if (typeof entry === 'string') {
    entrys = [entry]
    widthPolyfillEntrys = [widthPolyfillPath(entry)]
    widthPolyfillEntry = widthPolyfillPath(entry)
  }

  if (Array.isArray(entry)) {
    entry.forEach((path) => {
      if (isJs(path)) {
        entrys.push(path)
        widthPolyfillEntrys.push(widthPolyfillPath(path))
        widthPolyfillEntry.push(widthPolyfillPath(path))
      } else {
        widthPolyfillEntry.push(path)
      }
    })
  }

  if (!Array.isArray(entry) && typeof entry === 'object') {
    widthPolyfillEntry = {}

    Object.keys(entry).forEach((key) => {
      const current = entry[key]
      if (typeof current === 'string') {
        entrys.push(current)
        widthPolyfillEntrys.push(widthPolyfillPath(current))
        widthPolyfillEntry[key] = widthPolyfillPath(current)
      }
      if (Array.isArray(current)) {
        widthPolyfillEntry[key] = []
        current.forEach((path) => {
          if (isJs(path)) {
            entrys.push(path)
            widthPolyfillEntrys.push(widthPolyfillPath(path))
            widthPolyfillEntry[key].push(widthPolyfillPath(path))
          } else {
            widthPolyfillEntry[key].push(path)
          }
        })
      }
    })
  }

  [...new Set(entrys)].forEach((path) => {
    try {
      const files = dependency(path)

      files.forEach(({ content }) => {
        modules = getModules(content).packages.concat(modules)
      })
    } catch (e) {
      global.console.warn('Analyze file dependencies error: ', path)
    }
  })

  return {
    modules: [...new Set(modules)],
    entrys: [...new Set(entrys)],
    widthPolyfillEntry,
    widthPolyfillEntrys: [...new Set(widthPolyfillEntrys)],
  }
}
