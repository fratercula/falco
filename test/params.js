const assert = require('power-assert')
const falco = require('../')

describe('params', () => {
  it('esModules', async () => {
    const config = {
      entry: { js: 'console.log(2)' },
      esModules: false,
    }

    const { codes } = await falco(config)
    assert(codes.map(s => s.name).join() === 'index.js,index.js.map')
  })

  it('entry', async () => {
    let error
    try {
      await falco({
        entry: {
          main: 'noexist.js',
          path: __dirname,
        },
      })
    } catch (e) {
      error = e.message
    }
    assert(error === 'webpack build error')
  })
})
