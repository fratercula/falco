#!/usr/bin/env node

const { join } = require('path')
const { outputFileSync } = require('fs-extra')
const minimist = require('minimist')
const falco = require('../lib/compiler')
const exportEslint = require('../lib/helper/eslint')
const { version } = require('../package.json')

const {
  v,
  p,
  d,
  c,
  o = 'dist',
  m = 'index.js',
  t = 'index.html',
} = minimist(process.argv.slice(2))

if (v) {
  global.console.log(version)
  process.exit(0)
}

const cwd = process.cwd()
const port = Number(p) || undefined
const config = {
  entry: join(cwd, m),
  template: join(cwd, t),
  port,
  mode: d ? 'development' : 'production',
}

let localConfig = {}

if (c) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    localConfig = require(join(cwd, 'falco.config.js'))
  } catch ({ message }) {
    global.console.error(message)
  }
}

(async () => {
  try {
    const options = { output: {}, ...config, ...localConfig }

    if (options.vscodeEslint === true && options.mode === 'development') {
      await exportEslint()
    }

    const { mode, codes, template } = await falco(options)
    const dist = join(cwd, o)

    if (mode === 'development') {
      return
    }

    if (options.output.libraryTarget === undefined) {
      outputFileSync(join(dist, 'index.html'), template)
    }

    codes.forEach(({ name, content }) => {
      outputFileSync(join(dist, name), content)
    })
  } catch ({ message }) {
    global.console.error(message)
  }
})()
