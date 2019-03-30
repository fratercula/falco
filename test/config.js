const assert = require('power-assert')
const { join } = require('path')
const { removeSync } = require('fs-extra')
const falco = require('../')
const getConfig = require('./fixtures/config')
const js = require('./fixtures/codes/js')
const css = require('./fixtures/codes/css')
const less = require('./fixtures/codes/less')
const ts = require('./fixtures/codes/ts')

describe('config', () => {
  it('template', async () => {
    const config = getConfig({
      entry: { js },
      mode: 'development',
      template: join(__dirname, 'fixtures/template.html'),
    })

    const { mode, template } = await falco(config)

    assert(mode === 'production')
    assert(template.includes('@Falco'))
  })

  it('multiple entry, ts', async () => {
    const config = getConfig({
      entry: [{ js, css }, { css: less }, { js: ts, type: 'ts' }],
    })

    const { codes } = await falco(config)
    assert(codes.map(s => s.name).join() === 'index.js,index.js.map')
  })

  it('tmpDir, sourceMap, packages', async () => {
    const tmpDir = join(__dirname, 'temp')

    afterEach(() => {
      removeSync(tmpDir)
    })

    const config = getConfig({
      entry: [{ js }],
      tmpDir,
      sourceMap: false,
      packages: {
        five: '0.7.0',
      },
    })

    const { codes } = await falco(config)
    const pkg = require('./temp/package.json') // eslint-disable-line
    assert(pkg.dependencies.five === '^0.7.0')
    assert(codes.map(s => s.name).join() === 'index.js')
  })
})
