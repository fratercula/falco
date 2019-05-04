const { readFileSync } = require('fs-extra')
const { UNPKG, HTML, BODY_TAG } = require('../config')

module.exports = (externals, webpackConfig = {}, assets = []) => {
  const {
    template,
    esModules = true,
    output = {},
    mode,
  } = webpackConfig
  const config = {}

  let scripts = []
  let html = HTML

  try {
    html = readFileSync(template, 'utf8')
  } catch (e) {
    // ignore
  }

  externals.forEach(({
    name,
    root,
    urls,
    ...extra
  }) => {
    if (output.library !== undefined || output.libraryTarget !== undefined) {
      config[name] = {
        root,
        ...extra,
      }
    } else {
      config[name] = root
    }

    if (urls) {
      scripts = scripts.concat(typeof urls === 'string' ? [urls] : urls)
    } else {
      scripts.push(`${UNPKG}/${name}`)
    }
  })

  if (mode === 'development') {
    assets.push({ name: 'index.js' })
  }

  const outputs = assets
    .filter(({ name }) => !name.includes('.js.map'))
    .map(({ name }) => `./${name}`)

  const tags = scripts
    .concat(outputs)
    .map((src) => {
      if (esModules && src.includes('./')) {
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
