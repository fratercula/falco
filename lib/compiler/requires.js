module.exports = (config) => {
  const { mode, modules, externals } = config
  const ignores = externals.map(({ name }) => name)
  const installs = modules.filter((name) => !ignores.includes(name))
  const dependencies = modules.length && mode === 'production'
    ? modules.filter((name) => ignores.includes(name))
    : ignores

  return { installs, dependencies: [...new Set(dependencies)] }
}
