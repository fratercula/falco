const assert = require('power-assert')
const external = require('../../lib/helper/external')

describe('external', () => {
  const config = {
    externals: [
      {
        urls: '',
        root: 'React',
        name: 'react',
      },
      {
        urls: '',
        root: 'ReactDOM',
        name: 'react-dom',
      },
    ],
  }

  it('test', () => {
    let result = external(config)
    assert(result.react === 'React')
    assert(result['react-dom'] === 'ReactDOM')

    const specific = [
      {
        urls: '',
        root: 'five',
        name: 'five',
        amd: 'five',
      },
    ]

    result = external(config, specific)
    assert(result.five === 'five')

    config.output = { library: 'x' }
    result = external(config, specific)
    assert(result.five.amd === 'five')

    config.output = { libraryTarget: 'umd' }
    result = external(config, specific)
    assert(result.five.amd === 'five')
  })
})
