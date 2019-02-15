#!/usr/bin/env node

const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const minimist = require('minimist')
const logger = require('@acyort/logger')('falco')
const falco = require('../lib/compiler')

const {
  p,
  d,
  r,
  c,
  m = 'index.js',
} = minimist(process.argv.slice(2))
const cwd = process.cwd()
const port = Number(p) || undefined
const config = {
  entry: {
    main: m,
    path: cwd,
  },
  registry: r,
  port,
  mode: d ? 'development' : 'production',
}

let localConfig = {}

if (c) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    localConfig = require(join(cwd, 'palco.config.js'))
  } catch (e) {
    logger.info(e.message)
  }
}

try {
  (async () => {
    const {
      mode,
      code,
      sourceMap,
      template,
    } = await falco({ ...config, ...localConfig })
    const dist = join(cwd, 'dist')

    if (mode === 'development') {
      return
    }

    outputFileSync(join(dist, 'index.html'), template)
    outputFileSync(join(dist, 'output.js'), code)
    if (sourceMap) {
      outputFileSync(join(dist, 'output.js.map'), sourceMap)
    }
  })()
} catch ({ message }) {
  logger.error(message)
}
