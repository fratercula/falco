const { join } = require('path')
const logger = require('@acyort/logger')('falco')
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
      const { contents, isVue } = dependency(entry.path, entry.main)

      config.isVue = isVue
      contents.forEach((file) => {
        config.modules = getModules(file).packages.concat(config.modules)
      })
    } catch (e) {
      logger.warn('cannot analyze entry files dependency')
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
