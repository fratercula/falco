const { join } = require('path')
const http = require('http')
const assert = require('power-assert')
const falco = require('../')
const getConfig = require('./fixtures/config')

const sleep = (t = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve()
  }, t)
})

function request(path = '/', port = 2222) {
  return new Promise(resolve => http.get({
    host: '127.0.0.1',
    port,
    path,
  }, (res) => {
    resolve(res.statusCode)
  }))
}

describe('server', () => {
  it('react', async () => {
    const config = getConfig({
      entry: {
        main: 'index.js',
        path: join(__dirname, 'fixtures/react'),
      },
      mode: 'development',
    })

    const { server } = await falco(config)
    await sleep()
    const code = await request()
    assert(code === 200)
    server.close()
  })

  it('vue', async () => {
    const config = getConfig({
      entry: {
        main: 'index.js',
        path: join(__dirname, 'fixtures/vue'),
      },
      mode: 'development',
    })

    const { server } = await falco(config)
    await sleep()
    const code = await request()
    assert(code === 200)
    server.close()
  })

  it('ts', async () => {
    const config = getConfig({
      entry: {
        main: 'index.tsx',
        path: join(__dirname, 'fixtures/ts'),
      },
      mode: 'development',
      port: 8000,
    })

    const { server } = await falco(config)
    await sleep()
    const code = await request('/', 8000)
    assert(code === 200)
    server.close()
  })
})
