const assert = require('power-assert')
const { resolve } = require('path')
const getEntry = require('../../lib/compiler/entry')

describe('entry', () => {
  it('string', () => {
    const entry = resolve(__dirname, '../fixtures/ts/index.tsx')
    const config = getEntry(entry)
    assert(config.widthPolyfillEntry.includes('__falco__index.tsx'))
    assert(config.modules.includes('react-dom'))
  })

  it('array', () => {
    const entry = [resolve(__dirname, '../fixtures/ts/index.tsx')]
    const config = getEntry(entry)
    assert(config.modules.includes('react-dom'))
    assert(config.widthPolyfillEntrys[0].includes('__falco__index.tsx'))
  })

  it('object', () => {
    const entry = {
      index: resolve(__dirname, '../fixtures/ts/index.tsx'),
      home: [resolve(__dirname, '../fixtures/ts/index.tsx')],
    }
    const config = getEntry(entry)
    assert(config.modules.includes('react-dom'))
    assert(config.widthPolyfillEntry.index.includes('__falco__index.tsx'))
  })

  it('error', () => {
    const entry = resolve(__dirname, '../fixtures/ts/index.js')
    const config = getEntry(entry)
    assert(config.widthPolyfillEntry.includes('__falco__index.js'))
    assert(config.modules.length === 0)
  })
})
