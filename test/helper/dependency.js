const assert = require('power-assert')
const expect = require('expect')
const { resolve } = require('path')
const dependency = require('../../lib/helper/dependency')

describe('dependency', () => {
  it('error main', () => {
    const entry = resolve(__dirname, '../fixtures/react/notexist.js')

    expect(() => dependency(entry))
      .toThrow(`File path error: ${entry}`)
  })

  it('react', () => {
    const entry = resolve(__dirname, '../fixtures/react/index.js')
    const trees = [
      'index.js',
      'components/index.js',
      'components/index.less',
      'components/back.svg',
      'index.css',
      'dir.js',
    ]

    assert(dependency(entry).map(({ path }) => path).join() === trees.join())
  })

  it('ts', () => {
    const entry = resolve(__dirname, '../fixtures/ts/index.tsx')
    const trees = ['index.tsx', 'hello.tsx']

    assert(dependency(entry).map(({ path }) => path).join() === trees.join())
  })
})
