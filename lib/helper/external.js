const { UNPKG, HTML, BODY_TAG } = require('../config')

module.exports = (externals, html = HTML) => {
  const config = {}
  let scripts = []

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

  const tags = scripts.map(src => `<script src="${src}"></script>`).join('\n')
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
