const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const getModules = require('../helper/module')
const dependency = require('../helper/dependency')
const { JS_EXTENSIONS } = require('../config')

module.exports = (entry, tmpDir) => {
  const config = {
    entry: [],
    packages: [],
    isVue: false,
  }

  if (entry.main) {
    config.entry.push(join(entry.path, entry.main))

    const { contents, isVue } = dependency(entry.path, entry.main)

    config.isVue = isVue
    contents.forEach((file) => {
      config.packages = getModules(file).packages.concat(config.packages)
    })
  } else {
    config.mode = 'production';

    (Array.isArray(entry) ? entry : [entry]).forEach(({ js, css, type = 'js' }, i) => {
      const ext = JS_EXTENSIONS.includes(type) ? type : 'js'
      if (js) {
        outputFileSync(join(tmpDir, `js${i}.${ext}`), js)
        config.entry.push(join(tmpDir, `js${i}.${ext}`))
        config.packages = getModules(js).packages.concat(config.packages)
      }
      if (css) {
        outputFileSync(join(tmpDir, `css${i}.css`), css)
        config.entry.push(join(tmpDir, `css${i}.css`))
        config.packages = getModules(css).packages.concat(config.packages)
      }
    })
  }

  config.packages = [...new Set(config.packages)]

  return config
}
