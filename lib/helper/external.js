const { UNPKG, HTML } = require('../config')

module.exports = (externals, unpkg = UNPKG) => {
  const config = {}
  let scripts = []

  Object.keys(externals).forEach((pkg) => {
    const value = externals[pkg]

    if (!Array.isArray(value)) {
      scripts.push(`${unpkg}/${pkg}`)
      config[pkg] = value
    } else {
      scripts = scripts.concat(value.slice(1));
      [config[pkg]] = value
    }
  })

  return {
    html: HTML.replace('$script$', scripts
      .map(src => `<script src="${src}"></script>`).join('\n')),
    config,
  }
}
