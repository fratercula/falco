const assert = require('power-assert')
const { resolve } = require('path')
const getEntry = require('../../lib/compiler/entry')

describe('entry', () => {
  it('ts', () => {
    const entry = resolve(__dirname, '../fixtures/ts/index.tsx')
    const config = getEntry(entry)
    assert(config.entry[0] === entry)
    assert(config.modules.join() === 'react,react,react-dom')
  })

  it('error', () => {
    const entry = resolve(__dirname, '../fixtures/ts/index.js')
    const config = getEntry(entry)
    assert(config.modules.length === 0)
  })
})
