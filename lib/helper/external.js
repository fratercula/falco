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

  externals.forEach(({ name, root, urls }) => {
    config[name] = root
    if (urls) {
      scripts = scripts.concat(urls)
    } else {
      scripts.push(`${UNPKG}/${name}`)
    }
  })

  const tags = scripts.concat(['./output.js'])
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
