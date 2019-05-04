const assert = require('power-assert')
const expect = require('expect')
const { resolve, join } = require('path')
const dependency = require('../../lib/helper/dependency')

describe('dependency', () => {
  it('error main', () => {
    const entry = resolve(__dirname, '../fixtures/react')
    const main = 'notexist.js'

    expect(() => dependency(entry, main))
      .toThrow(`File path error: ${join(entry, main)}`)
  })

  it('react', () => {
    const entry = resolve(__dirname, '../fixtures/react')
    const main = 'index.js'
    const trees = [
      'index.js',
      'components/index.js',
      'components/index.less',
      'components/back.svg',
      'index.css',
      'dir.js',
    ]

    assert(dependency(entry, main).map(({ path }) => path).join() === trees.join())
  })

  it('vue', () => {
    const entry = resolve(__dirname, '../fixtures/vue')
    const main = 'index.js'
    const trees = ['index.js', 'main.vue']

    assert(dependency(entry, main).map(({ path }) => path).join() === trees.join())
  })

  it('ts', () => {
    const entry = resolve(__dirname, '../fixtures/ts')
    const main = 'index.tsx'
    const trees = ['index.tsx', 'hello.tsx']

    assert(dependency(entry, main).map(({ path }) => path).join() === trees.join())
  })
})
