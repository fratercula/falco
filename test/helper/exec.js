const assert = require('power-assert')
const { join } = require('path')
const exec = require('../../lib/helper/exec')

describe('exec', () => {
  it('empty', async () => {
    const result = await exec('')
    assert(result === undefined)
  })

  it('normal command', async () => {
    const command = 'npm root'
    let result = await exec(command)
    assert(result.length === 0)
    result = await exec('echo')
    assert(result.length === 0)
  })

  it('get log', async () => {
    const command = 'npm root'
    const result = await exec(command, ['!'])
    assert(result[0] === join(process.cwd(), 'node_modules'))
  })

  it('error command', async () => {
    const command = 'npm run notexist'
    try {
      await exec(command, ['=npm', '~ERR!'])
    } catch (e) {
      assert(e === undefined)
    }
  })
})
