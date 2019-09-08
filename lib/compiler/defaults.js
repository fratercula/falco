const { TMP_DIR } = require('../config')

module.exports = (config) => {
  const {
    entry = {},
    externals = [],
    packages = [],
    npm = {},
    esModules = true,
    tmpDir = TMP_DIR,
    targets = {},
    debug = false,
    cssModule = false,
    output = {},
    report = false,
    port = 2222,
    sourceMap = true,
    template = undefined,
    env = undefined,
  } = config
  const mode = config.mode === 'development' ? 'development' : 'production'

  return {
    entry,
    externals,
    packages,
    npm,
    esModules,
    tmpDir,
    targets,
    debug,
    cssModule,
    output,
    report,
    port,
    sourceMap,
    template,
    env,
    mode,
  }
}
