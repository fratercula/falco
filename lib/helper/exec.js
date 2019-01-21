const { exec } = require('child_process')
const logger = require('@acyort/logger')('falco')

module.exports = (commands) => {
  const cmd = exec(commands)

  cmd.stdout.on('data', data => logger.info(data))
  cmd.stderr.on('data', data => logger.warn(data))

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
