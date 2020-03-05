const { TMP_DIR } = require('../config')

module.exports = (config) => {
  const {
    entry = {},
    externals = [],
    packages = [],
    npm = {},
    tmpDir = TMP_DIR,
    targets = 'defaults',
    debug = false,
    output = {},
    report = false,
    port = 2222,
    sourceMap = true,
    template = undefined,
    env = undefined,
    loaders = [],
    injectScript = true,
  } = config
  const mode = config.mode === 'development' ? 'development' : 'production'

  return {
    entry,
    externals,
    packages,
    npm,
    tmpDir,
    targets,
    debug,
    output,
    report,
    port,
    sourceMap,
    template,
    env,
    mode,
    loaders,
    injectScript,
  }
}
