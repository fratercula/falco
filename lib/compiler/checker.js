const { REGEX } = require('../config')
const exec = require('../helper/exec')
const npmInstall = require('../helper/npm')
const packageName = require('../helper/name')

module.exports = async function checker(stats, next) {
  const { errors } = stats.toJson('minimal')
  const missModules = []
  const { tmpDir, packages, npm } = this

  errors.forEach((e) => {
    const [, name = ''] = e.match(REGEX.resolve) || []
    if (name.charAt(0) !== '.') {
      missModules.push(packageName(name))
    }
  })

  if (missModules.length) {
    try {
      await exec(npmInstall({
        npm,
        prefix: tmpDir,
        modules: missModules,
        packages,
      }), ['=npm', '=npm WARN', '~peer dependencies'])
    } catch (e) {
      // ignore
    }
    next()
  } else {
    next()
  }
}
