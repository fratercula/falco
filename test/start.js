const { join } = require('path')
const getConfig = require('./fixtures/config')
const falco = require('../');

(async () => {
  const { externals } = getConfig({})
  try {
    const { codes, template } = await falco({
      sourceMap: false,
      entry: {
        path: join(__dirname, 'fixtures', 'react'),
        main: 'index.js',
      },
      mode: 'development',
      env: 'production',
      externals,
      // report: true,
      npm: {
        registry: 'https://registry.npm.taobao.org',
      },
    })

    global.console.log(codes)
    global.console.log(template)
  } catch (e) {
    global.console.error(e)
  }
})()
