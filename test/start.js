const { join } = require('path')
const falco = require('../')

const getConfig = config => ({
  externals: [
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
      name: 'vue',
      root: 'Vue',
    },
    {
      name: 'antd',
      root: 'antd',
      urls: ['https://unpkg.com/moment@2.24.0/min/moment.min.js', 'https://unpkg.com/antd@3.13.0/dist/antd-with-locales.min.js'],
    },
  ],
  ...config,
});


(async () => {
  const { externals } = getConfig({})
  try {
    const {
      codes,
      template,
      server,
      ...rest
    } = await falco({
      sourceMap: false,
      entry: join(__dirname, 'fixtures', 'react', 'index.js'),
      // mode: 'development',
      env: 'production',
      externals,
      report: true,
      npm: {
        registry: 'https://registry.npm.taobao.org',
      },
    })

    global.console.log(rest)
  } catch (e) {
    global.console.error(e)
  }
})()
