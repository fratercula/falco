const webpack = require('webpack')
const config = require('./webpack')

webpack(config, (err, stats) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(stats)
})
