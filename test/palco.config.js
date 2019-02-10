const { join } = require('path')

module.exports = {
  entry: {
    main: 'index.js',
    path: join(process.cwd(), 'vue'),
  },
}
