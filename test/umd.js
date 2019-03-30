const assert = require('power-assert')
const falco = require('../')
const getConfig = require('./fixtures/config')
const umd = require('./fixtures/codes/umd')

describe('umd', () => {
  it('mode', async () => {
    const config = getConfig({
      entry: { js: umd },
      output: {
        library: 'Ta',
        libraryTarget: 'umd',
      },
      mode: 'development',
    })

    const { mode, codes, dependencies } = await falco(config)

    assert(mode === 'production')
    assert(codes[0].name = 'index.js')
    assert(codes[1].name = 'index.map.js')
    assert(dependencies.join() === 'react')
  })
})
