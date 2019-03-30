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

function request(path = '/') {
  return new Promise(resolve => http.get({
    host: '127.0.0.1',
    port: '2222',
    path,
  }, (res) => {
    resolve(res.statusCode)
  }))
}

describe('directory', () => {
  it('server', async () => {
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
})
