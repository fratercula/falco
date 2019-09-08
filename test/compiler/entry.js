const assert = require('power-assert')
const { resolve } = require('path')
const { tmpdir } = require('os')
const getEntry = require('../../lib/compiler/entry')

describe('entry', () => {
  it('ts', () => {
    const entry = resolve(__dirname, '../fixtures/ts/index.tsx')
    const config = getEntry(entry)
    assert(config.isVue === false)
    assert(config.entry[0] === entry)
    assert(config.modules.join() === 'react,react,react-dom')
  })

  it('error', () => {
    const entry = resolve(__dirname, '../fixtures/ts/index.js')
    const config = getEntry(entry)
    assert(config.isVue === false)
    assert(config.entry[0] === entry)
    assert(config.modules.length === 0)
  })

  it('codes', () => {
    let entry = {
      js: "import five from 'five'",
      css: 'body { background: grey; }',
    }
    let result = getEntry(entry, tmpdir())

    assert(result.mode === 'production')
    assert(result.isVue === false)
    assert(result.modules[0] === 'five')
    assert(result.entry[0].includes('js0.js') === true)
    assert(result.entry[1].includes('css0.css') === true)

    entry = [entry, {
      js: 'const x: number = 0; console.log(x)',
      css: '@width: 10px;',
      type: 'ts',
    }, {}, { ...entry, type: 'unknow' }]
    result = getEntry(entry, tmpdir())

    assert(result.entry.length === 6)
    assert(result.entry[2].includes('js1.ts') === true)
  })
})
