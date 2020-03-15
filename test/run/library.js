const assert = require('power-assert')
const { resolve } = require('path')
const falco = require('../..')

describe('umd', () => {
  it('mode', async () => {
    const config = {
      externals: [
        {
          name: 'react',
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react',
        },
      ],
      entry: resolve(__dirname, '../fixtures/library.js'),
      output: {
        library: 'T',
        libraryTarget: 'umd',
      },
      mode: 'production',
    }

    const { mode, codes, dependencies } = await falco(config)

    assert(mode === 'production')
    assert(codes.map((s) => s.name).join() === 'main.js,main.js.map')
    assert(dependencies.join() === 'react')
  })
})
