module.exports = (config) => {
  const { prefix, packages, npm } = config
  const modules = [...new Set(config.modules)]
    .filter((m) => m)
    .map((name) => {
      const version = packages[name]
      if (version) {
        return `${name}@${version}`
      }
      return name
    })
    .join(' ')
  const options = {
    'no-audit': true,
    production: true,
    ...npm,
    'no-package-lock': true,
    prefix,
  }
  const args = []

  if (!modules) {
    return ''
  }

  Object.keys(options).forEach((arg) => {
    args.push(`--${arg}=${options[arg]}`)
  })

  global.console.log(`Installing: ${modules}`)

  return `npm install ${args.join(' ')} ${modules}`
}
