const assert = require('power-assert')
const npmInstall = require('../../lib/helper/npm')

describe('npmInstall', () => {
  it('test', () => {
    const config = {
      prefix: 'path/to',
      packages: {
        react: '*',
      },
      npm: {
        registry: 'https://registry.npm.taobao.org',
      },
      modules: ['react', 'react-dom'],
    }

    assert(npmInstall(config) === 'npm install --no-audit=true --production=true --registry=https://registry.npm.taobao.org --no-package-lock=true --prefix=path/to react@* react-dom')

    config.modules = []
    assert(npmInstall(config) === '')
  })
})
