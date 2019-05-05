module.exports = (webpackConfig, specific) => {
  const externals = specific || webpackConfig.externals
  const { output: { library, libraryTarget } = {} } = webpackConfig
  const config = {}

  externals.forEach((external) => {
    const {
      name,
      root,
      urls,
      ...extra
    } = external

    if (library !== undefined || libraryTarget !== undefined) {
      config[name] = { root, ...extra }
    } else {
      config[name] = root
    }
  })

  return config
}
