const { exec } = require('child_process')
const logger = require('@acyort/logger')('falco')

module.exports = (commands, ignores = []) => {
  if (!commands) {
    return Promise.resolve()
  }

  const cmd = exec(commands)

  cmd.stdout.on('data', (data) => {
    if (data.trim() !== '') logger.info(data)
  })
  cmd.stderr.on('data', (data) => {
    for (let i = 0; i < ignores.length; i += 1) {
      const [prefix, ...rest] = ignores[i]
      const ignore = rest.join('')

      if (prefix === '~' && data.includes(ignore)) {
        return
      }
      if (prefix === '=' && data.trim() === ignore) {
        return
      }
    }
    if (data.trim() !== '') logger.warn(data)
  })

  return new Promise((resolve, reject) => {
    cmd.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject()
      }
    })
  })
}
