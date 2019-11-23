const { readFileSync } = require('fs-extra')
const { UNPKG, HTML, BODY_TAG } = require('../config')

module.exports = (config, dependencies, assets) => {
  const { template, targets } = config
  const externals = config.externals.filter(({ name }) => dependencies.includes(name))
  const result = []

  let scripts = []
  let html = HTML

  try {
    html = readFileSync(template, 'utf8')
  } catch (e) {
    // ignore
  }

  externals.forEach(({ urls, name }) => {
    if (urls) {
      scripts = scripts.concat(typeof urls === 'string' ? [urls] : urls)
    } else {
      scripts.push(`${UNPKG}/${name}`)
    }
  })

  scripts = scripts.concat(
    assets
      .filter(({ name }) => !name.includes('.js.map'))
      .map(({ name }) => `./${name}`),
  )

  const tags = scripts.map((src) => {
    if (targets.esmodules && src.includes('./')) {
      return `<script type="module" src="${src}"></script>`
    }
    return `<script src="${src}"></script>`
  })

  if (html.includes(BODY_TAG)) {
    const splited = html.split(BODY_TAG)
    result.push(
      splited[0],
      tags.join('\n'),
      `\n${BODY_TAG}`,
      splited[1],
    )
  } else {
    result.push(html, tags.join('\n'))
  }

  return result.join('')
}
