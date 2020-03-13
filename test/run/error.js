const assert = require('power-assert')
const falco = require('../..')

describe('build error or warn', () => {
  it('test', async () => {
    const config = {
      entry: { js: 'const 1 = 1' },
      sourceMap: false,
    }
    try {
      await falco(config)
    } catch (e) {
      assert(e.message === 'Webpack build error')
    }

    config.entry.js = `import nycticorax from 'nycticorax'
nycticorax.createStore({ a: 1 })`
    const { dependencies } = await falco(config)
    assert(dependencies.length === 0)
  })
})
