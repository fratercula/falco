const { resolve } = require('path')
const assert = require('power-assert')
const falco = require('../..')

const externals = [
  {
    name: 'react',
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react',
    urls: 'https://unpkg.com/react@16.7.0/umd/react.production.min.js',
  },
  {
    name: 'react-dom',
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom',
    urls: 'https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js',
  },
  {
    name: 'axios',
    root: 'axios',
  },
  {
    name: 'antd',
    root: 'antd',
    urls: ['https://unpkg.com/moment@2.24.0/min/moment.min.js', 'https://unpkg.com/antd@3.13.0/dist/antd-with-locales.min.js'],
  },
]

describe('build', () => {
  it('react', async () => {
    const config = {
      externals,
      entry: resolve(__dirname, '../fixtures/react/index.js'),
      env: 'production',
    }

    const { dependencies } = await falco(config)
    assert(dependencies.join() === 'react,react-dom')
  })
  it('ts', async () => {
    const config = {
      externals,
      entry: resolve(__dirname, '../fixtures/ts/index.tsx'),
    }

    const { dependencies } = await falco(config)
    assert(dependencies.join() === 'react,react-dom')
  })
})
