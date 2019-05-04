const { exec } = require('child_process')

module.exports = (commands, ignores = []) => {
  if (!commands) {
    return Promise.resolve()
  }

  const cmd = exec(commands)
  const logs = []

  cmd.stdout.on('data', (data) => {
    if (ignores.includes('!')) {
      logs.push(data.replace(/[\r\n]/g, '').trim())
      return
    }
    if (data.trim() !== '') {
      global.console.info(data)
    }
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
    if (data.trim() !== '') global.console.warn(data)
  })

  return new Promise((resolve, reject) => {
    cmd.on('exit', (code) => {
      if (code === 0) {
        resolve(logs)
      } else {
        reject()
      }
    })
  })
}
