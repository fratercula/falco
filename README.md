# Falco

JavaScript Transcoder

## Install

```js
$ npm i @fratercula/falco
```

## Usage

```js
const falco = require('@fratercula/falco')
const { tree } = require('@fratercula/falco')

const treeData = tree('path/to/codes/directory')

const options = {
  // see options below
}

;(async () => {
  try {
    const {
      code,
      sourceMap,
      dependencies,
      template,
      mode,
    } = await falco(options)
    // mode: development or production / string
    // template: html template / string
    // code: converted code / string
    // sourceMap: filename is `output.js.map` / string
    // dependencies: package dependence / array
  } catch (e) {
    console.log(e)
  }
})()
```

## Options

### entry

codes to be converted, type is `object` or `array`, required.

example:

```js
// basic
{
  entry: {
    js: 'console.log(1)',
    css: 'body { color: red }',
  },
}

// multiple
{
  entry: [{ js, css }, { js1, css1 }],
}

// directory
{
  entry: {
    main: 'index.js', // main entry
    path: '/path/to/your/codes/directory',
  },
}

// directory files tree data
const { tree } = require('@fratercula/falco')
const treeData = tree('path/to/codes/directory')

{
  entry: {
    main: 'index.js',
    data: treeData,
  },
}
```

### externals

same as webpack externals config, type is `object`, default `{}`

you can set external `umd` url

example:

```js
{
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
    react: ['React', 'https://unpkg.com/react@16.7.0/umd/react.production.min.js'],
    'react-dom': ['ReactDOM', 'https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js'],
    vue: ['Vue', 'https://unpkg.com/vue@2.6.6/dist/vue.min.js'],
    antd: ['antd', 'https://unpkg.com/moment@2.24.0/min/moment.min.js', 'https://unpkg.com/antd@3.13.0/dist/antd-with-locales.min.js'],
  },
}
```

### registry

set npm registry

example:

```js
{
  registry: 'https://registry.npm.taobao.org',
}
```

### esModules

@babel/preset-env [option](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules), default is `true`

example:

```js
{
  esModules: true,
}
```

### cssModule

[css module](https://github.com/css-modules/css-modules), default is `false`

example:

```js
{
  cssModule: false,
}
```

## CLI

install

```js
$ npm i @fratercula/falco -g
```

use

```bash
$ falco -p 2222 -d -r https://registry.npm.taobao.org -c -m vue.js

# p: server port, for development
# d: development mode
# r: option registry, set npm registry
# m: build main entry
# c: use local config: `falco.config.js`
```


## License

MIT

## Relevance

Falco peregrinus
