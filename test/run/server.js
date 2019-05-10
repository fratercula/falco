const { resolve, join } = require('path')
const os = require('os')
const { writeFileSync, removeSync } = require('fs-extra')
const assert = require('power-assert')
const falco = require('../../')

const sleep = (t = 1000) => new Promise((r) => {
  setTimeout(() => {
    r()
  }, t)
})

describe('server', () => {
  it('run and reinstall', async () => {
    const config = {
      entry: resolve(__dirname, '../fixtures/server.js'),
      mode: 'development',
    }
    const pkg = join(os.tmpdir(), 'FALCO', 'package.json')

    removeSync(pkg)
    removeSync(join(os.tmpdir(), 'FALCO', 'node_modules'))

    const { server } = await falco(config)
    await sleep()

    let code = 'import nycticorax from \'nycticorax\'\nconsole.log(five())'
    writeFileSync(resolve(__dirname, '../fixtures', 'server.js'), code)
    await sleep(5000)

    const { dependencies } = require(pkg) // eslint-disable-line
    assert(Object.keys(dependencies).includes('nycticorax') === true)

    code = 'console.log(5)'
    writeFileSync(resolve(__dirname, '../fixtures', 'server.js'), code)

    server.close()
  })
})
