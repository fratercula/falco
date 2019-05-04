const assert = require('power-assert')
const { tmpdir } = require('os')
const checker = require('../../lib/compiler/checker')

describe('checker', () => {
  const config = {
    tmpDir: tmpdir(),
    packages: {},
    npm: {},
  }

  it('no errors', async () => {
    const result = []
    const stats = { toJson: () => ({ errors: [] }) }
    const next = () => result.push('no errors')
    await checker.call(config, stats, next)
    assert(result.join() === 'no errors')
  })

  it('has errors', async () => {
    const files = "Module not found: Error: Can't resolve './dirs' in '/Users/am0200/Documents/github/falco/test/fixtures/react'"
    const packages = "Module not found: Error: Can't resolve 'five' in '/Users/am0200/Documents/github/falco/test/fixtures/react'"
    const result = []
    const stats = { toJson: () => ({ errors: [files, packages, 'Error while loading module a'] }) }
    const next = () => result.push('has errors')
    await checker.call(config, stats, next)
    assert(result.join() === 'has errors')
  })
})
