const assert = require('power-assert')
const getModule = require('../../lib/helper/module')

describe('get module', () => {
  it('test', () => {
    assert(getModule('import ./index.css\'').files.length === 0)
    assert(getModule('import ./index.css\'').packages.length === 0)
  })
})
