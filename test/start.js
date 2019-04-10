const { join } = require('path')
const falco = require('../');

(async () => {
  try {
    const { codes } = await falco({
      sourceMap: false,
      entry: {
        path: join(__dirname, 'fixtures', 'react'),
        main: 'index.js',
      },
      mode: 'development',
      // report: true,
      registry: 'https://registry.npm.taobao.org',
    })

    global.console.log(codes)
  } catch (e) {
    global.console.error(e)
  }
})()
