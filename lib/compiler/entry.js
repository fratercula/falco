const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const getModules = require('../helper/module')
const dependency = require('../helper/dependency')
const { JS_EXTENSIONS } = require('../config')

module.exports = (entry, tmpDir) => {
  const config = {
    entry: [],
    modules: [],
    isVue: false,
  }

  if (entry.main) {
    config.entry.push(join(entry.path, entry.main))

    try {
      const files = dependency(entry.path, entry.main)

      files.forEach(({ content, path }) => {
        config.modules = getModules(content).packages.concat(config.modules)
        if (path.includes('.vue')) {
          config.isVue = true
        }
      })
    } catch (e) {
      global.console.warn('Cannot analyze entry files dependency')
    }
  } else {
    config.mode = 'production';

    (Array.isArray(entry) ? entry : [entry]).forEach(({ js, css, type = 'js' }, i) => {
      const ext = JS_EXTENSIONS.includes(type) ? type : 'js'
      if (js) {
        outputFileSync(join(tmpDir, `js${i}.${ext}`), js)
        config.entry.push(join(tmpDir, `js${i}.${ext}`))
        config.modules = getModules(js).packages.concat(config.modules)
      }
      if (css) {
        outputFileSync(join(tmpDir, `css${i}.css`), css)
        config.entry.push(join(tmpDir, `css${i}.css`))
        config.modules = getModules(css).packages.concat(config.modules)
      }
    })
  }

  return config
}
