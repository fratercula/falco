const assert = require('power-assert')
const { resolve } = require('path')
const getTemplate = require('../../lib/compiler/template')

describe('get Template', () => {
  const config = {
    template: resolve(__dirname, '../fixtures/template.html'),
    externals: [
      { name: 'react', urls: ['a', 'b'] },
      { name: 'react-dom', urls: 'c' },
    ],
    injectScript: true,
    targets: { esmodules: false },
  }
  const dependencies = ['react']
  const assets = [{ name: 'index.js' }]

  it('width template', () => {
    const result = getTemplate(config, dependencies, assets)

    assert(result.includes('@Falco') === true)
    assert(result.includes('src="a"') === true)
    assert(result.includes('src="b"') === true)
    assert(result.includes('src="./index.js"') === true)
    assert(result.includes('type="module"') === false)
  })

  it('widthout template', () => {
    config.template = undefined
    config.targets = { esmodules: true }
    delete config.externals[0].urls

    const result = getTemplate(config, dependencies, assets)

    assert(result.includes('src="https://unpkg.com/react"') === true)
    assert(result.includes('type="module" src="./index.js"') === true)
  })

  it('mini template', () => {
    config.template = resolve(__dirname, '../fixtures/mini.html')
    config.externals[0].urls = 'react'

    const result = getTemplate(config, dependencies, assets)
    assert(result.includes('src="react"') === true)
    assert(result.includes('type="module" src="./index.js"') === true)
  })

  it('no inject script', () => {
    config.injectScript = false
    const result = getTemplate(config, dependencies, assets)
    assert(result.includes('script') === false)
  })
})
