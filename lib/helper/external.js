const { readFileSync } = require('fs-extra')
const { UNPKG, HTML, BODY_TAG } = require('../config')

module.exports = (externals, webpackConfig = {}) => {
  const { template, esModules = true } = webpackConfig
  const config = {}

  let scripts = []
  let html = HTML

  try {
    html = readFileSync(template, 'utf8')
  } catch (e) {
    // ignore
  }

  Object.keys(externals).forEach((pkg) => {
    const value = externals[pkg]

    if (!Array.isArray(value)) {
      scripts.push(`${UNPKG}/${pkg}`)
      config[pkg] = value
    } else {
      scripts = scripts.concat(value.slice(1));
      [config[pkg]] = value
    }
  })

  scripts.push('./output.js')

  const tags = scripts
    .map((src) => {
      if (esModules && src === './output.js') {
        return `<script type="module" src="${src}"></script>`
      }
      return `<script src="${src}"></script>`
    })
    .join('\n')
  const tpl = []

  if (html.includes(BODY_TAG)) {
    const splited = html.split(BODY_TAG)
    tpl.push(splited[0], tags, `\n${BODY_TAG}`, splited[1])
  } else {
    tpl.push(html, tags)
  }

  return {
    html: tpl.join(''),
    config,
  }
}
