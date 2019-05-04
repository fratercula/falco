const assert = require('power-assert')
const name = require('../../lib/helper/name')

describe('pkgName', () => {
  it('test', () => {
    assert(name('s.js') === 's.js')
    assert(name('@s/s') === '@s/s')
    assert(name('@s/s/s.js') === '@s/s')
  })
})
