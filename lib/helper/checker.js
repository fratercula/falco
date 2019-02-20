const logger = require('@acyort/logger')('falco')
const { REGEX } = require('../config')
const exec = require('../helper/exec')

module.exports = async function checker(stats, next) {
  const { errors } = stats.toJson('minimal')
  const missModules = []
  const { registry, tmpDir } = this

  errors.forEach((e) => {
    const [, name = ''] = e.match(REGEX.resolve) || []
    if (name.charAt(0) !== '.') {
      missModules.push(name)
    }
  })

  if (missModules.length) {
    logger.info(`installing modules... ${missModules.join(', ')}`)
    await exec(`npm install${registry ? ` --registry=${registry}` : ''} --no-package-lock --no-audit --prefix ${tmpDir} ${missModules.join(' ')}`)
    next()
  } else {
    next()
  }
}
