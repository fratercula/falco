#!/usr/bin/env node

const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const minimist = require('minimist')
const logger = require('@acyort/logger')('falco')
const falco = require('../lib/compiler')
const external = require('../lib/helper/external')

const {
  p,
  d,
  r,
  c,
  m = 'index.js',
} = minimist(process.argv.slice(2))
const cwd = process.cwd()
const mode = d ? 'development' : 'production'
const port = Number(p) || undefined
const config = {
  entry: {
    main: m,
    path: cwd,
  },
  registry: r,
  port,
  mode,
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

falco({ ...config, ...localConfig })
  .then(({ code, sourceMap, dependencies }) => {
    if (!code) {
      return
    }
    const distDir = join(cwd, 'dist')
    const { externals, unpkg } = localConfig
    const exts = {}

    dependencies.forEach((name) => {
      exts[name] = externals[name]
    })

    const { html } = external(exts, unpkg)

    outputFileSync(join(distDir, 'index.html'), html)
    outputFileSync(join(distDir, 'output.js'), code)
    if (sourceMap) {
      outputFileSync(join(distDir, 'output.js.map'), sourceMap)
    }
  })
  .catch(({ message }) => logger.error(message))
