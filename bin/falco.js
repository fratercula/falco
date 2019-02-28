#!/usr/bin/env node

const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const minimist = require('minimist')
const logger = require('@acyort/logger')('falco')
const falco = require('../lib/compiler')
const { OUTPUT } = require('../lib/config')

const {
  p,
  d,
  r,
  c,
  o = 'dist',
  m = 'index.js',
  t = 'index.html',
} = minimist(process.argv.slice(2))
const cwd = process.cwd()
const port = Number(p) || undefined
const config = {
  entry: {
    main: m,
    path: cwd,
  },
  template: join(cwd, t),
  registry: r,
  port,
  mode: d ? 'development' : 'production',
}

let localConfig = {}

if (c) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    localConfig = require(join(cwd, 'falco.config.js'))
  } catch ({ message }) {
    logger.error(message)
  }
}

(async () => {
  try {
    const options = { output: {}, ...config, ...localConfig }
    const {
      mode,
      code,
      sourceMap,
      template,
    } = await falco(options)
    const dist = join(cwd, o)

    if (mode === 'development') {
      return
    }

    if (options.output.libraryTarget === undefined) {
      outputFileSync(join(dist, 'index.html'), template)
    }

    outputFileSync(join(dist, OUTPUT), code)

    if (sourceMap) {
      outputFileSync(join(dist, `${OUTPUT}.map`), sourceMap)
    }
  } catch ({ message }) {
    logger.error(message)
  }
})()
