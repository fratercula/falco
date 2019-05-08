const assert = require('power-assert')
const getRequires = require('../../lib/compiler/requires')

describe('get requires', () => {
  it('test', () => {
    const externals = [
      {
        name: 'react',
      },
      {
        name: 'react-dom',
      },
    ]
    const config = {
      externals,
      mode: 'production',
      modules: ['react', 'five'],
    }

    let result = getRequires(config)

    assert(result.installs.join() === 'five')
    assert(result.dependencies.join() === 'react')

    config.mode = 'development'

    result = getRequires(config)
    assert(result.dependencies.join() === 'react,react-dom')
  })
})
