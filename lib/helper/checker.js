const { REGEX } = require('../config')
const exec = require('../helper/exec')
const npmInstall = require('./npm')

module.exports = async function checker(stats, next) {
  const { errors } = stats.toJson('minimal')
  const missModules = []
  const { registry, tmpDir, packages } = this

  errors.forEach((e) => {
    const [, name = ''] = e.match(REGEX.resolve) || []
    if (name.charAt(0) !== '.') {
      missModules.push(name)
    }
  })

  if (missModules.length) {
    await exec(npmInstall({
      registry,
      prefix: tmpDir,
      modules: missModules,
      packages,
    }))
    next()
  } else {
    next()
  }
}
