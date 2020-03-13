const assert = require('power-assert')
const { resolve } = require('path')
const falco = require('../..')

describe('build error or warn', () => {
  it('test', async () => {
    const config = {
      entry: resolve(__dirname, '../fixtures/error.js'),
      sourceMap: false,
      targets: { esmodules: true },
    }
    try {
      await falco(config)
    } catch (e) {
      assert(e.message === 'Webpack build error')
    }
  })
})
