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
    assert(codes.map(s => s.name).join() === 'index.js,index.js.map')
    assert(dependencies.join() === 'react')
  })
})
