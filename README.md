# Falco

[![Build Status](https://travis-ci.org/fratercula/falco.svg?branch=master)](https://travis-ci.org/fratercula/falco)
[![codecov](https://codecov.io/gh/fratercula/falco/branch/master/graph/badge.svg)](https://codecov.io/gh/fratercula/falco)

JavaScript Runner. run and build codes with `zero` configuration

![falco](https://user-images.githubusercontent.com/2193211/55216793-afa54180-5238-11e9-9cda-f1c702dcd97b.gif)

## Install

```bash
$ npm i @fratercula/falco

# CLI
$ npm i @fratercula/falco -g
```

## Usage

```js
const falco = require('@fratercula/falco')

const options = {
  entry: 'path/to/build/index.js',
  npm: {
    registry: 'https://registry.npm.taobao.org',
  },
  externals: {
    // ...
  },
  template: path.join(process.cwd(), 'index.html'),
  port: 8000,
  mode: 'development',
}

;(async () => {
  try {
    const {
      codes,
      dependencies,
      template,
      mode,
      server,
    } = await falco(options)
  } catch (e) {
    console.log(e)
  }
})()
```

**Callback Parameters**

- codes: webpack build codes, sourceMaps
- dependencies: build codes dependencies modules
- template: output html
- mode: `development` or `production`
- server: webpack dev server, only in `development` mode

**Files Trees**

```js
const { trees } = require('@fratercula/falco')

trees('path/to/entry/index.js')
/*
[
  {
    path: 'index.js',
    content: 'import React from \'react\'\nimport \'reset-css/less/reset.less\'\nimport \'./index.less\'\n\nexport default function () {\n  return (\n    <div>component</div>\n  )\n}\n',
  },
  {
    path: 'components/index.js',
    content: '...',
  }
  ...
]
*/
```

## CLI

```bash
$ falco -p 2222 -d -c -m main.js -t template.html -o lib
```

Arguments

- `-v`: show version
- `-d`: set `development` mode
- `-p`: webpack dev server port, for `development` only, default is `2222`
- `-m`: webpack entry path, default is `index.js`
- `-c`: use config `falco.config.js`
- `-t`: use template, default is `index.html`
- `-o`: set output path, default is `dist`
- `--eslint`: for `vscode` only, export vscode `eslint.nodePath` config. built in `eslint-config-airbnb`, `babel-eslint`

`falco.config.js` example:

```js
module.exports = {
  mode: 'development',
  output: {
    filename: 'index.[hash:8].js',
    library: 'Yy',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  report: true,
  debug: true,
  targets: {
    ie: '8',
  },
}
```

## Options

| Property | description | Type | Default |
| ---- | ---- | --- | --- |
| entry | webpack entry, required  | `string` \| `array` \| `object` | - |
| externals | webpack externals | `array` | `[]` |
| packages | set packages version | `object` | `{}` |
| template | html template | `string` | - |
| tmpDir | temp files directory | `string` | `os.tmpDir()` |
| npm | npm options | `object` | `{}` |
| output | webpack output option | `object` | `{}` |
| debug | `babel loader` debug option | `boolean` | `false` |
| loaders | add webpack loaders, you should install the `loader` plugin locally | `array` | `[]` |
| sourceMap | enable `sourceMap` | `boolean` | `true` |
| targets | `browserlist` targets | `object` \| `array` \| `string`  | `{}` |
| report | enable `webpack-bundle-analyzer` | `boolean` | `false` |
| injectScript | inject scripts into template | `boolean` | `true` |
| env | set `NODE_ENV` | `string` | - |
| contentBase | webpack `contentBase` option | `string` | `os.tmpDir()` |

## Options Example

**entry**

```js
// path
{
  entry: '/path/to/your/codes/directory/index.js',
}

// array
{
  entry: ['path/to/js0', 'path/to/js1'],
}

// object
{
  entry: {
    index: 'path/to/index',
    home: ['path/to/home'],
  }
}
```

**externals**

```js
{
  // note the order in sequence
  externals: [
    {
      name: 'react', // package name
      root: 'React', // window.React
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      urls: 'https://unpkg.com/react@16.7.0/umd/react.production.min.js', // umd url
    },
    {
      name: 'react-dom',
      root: 'ReactDOM',
      urls: 'https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js',
    },
    {
      // use `https://unpkg.com/axios`
      name: 'axios',
      root: 'axios',
    },
    {
      name: 'antd',
      root: 'antd',
      // `moment` is `antd` dependency
      urls: ['https://unpkg.com/moment@2.24.0/min/moment.min.js', 'https://unpkg.com/antd@3.13.0/dist/antd-with-locales.min.js'],
    },
  ],
}
```

**packages**

packages list here will be installed, ignore `externals`

```js
{
  packages: {
    react: '^13.5.9',
  },
}
```

**template**

```js
{
  template: 'path/to/html',
}
```

**tmpDir**

```js
{
  tmpDir: path.join(__dirname, 'temp'),
}
```

**npm**

cannot set `no-package-lock` and `prefix`

```js
// default
{
  npm: {
    'no-audit': true,
    production: true,
  },
}

// example
{
  npm: {
    registry: 'https://registry.npm.taobao.org',
    'prefer-offline': true,
    disturl: 'https://npm.taobao.org/dist',
    // ...
  },
}
```

**output**

cannot set `path`

```js
{
  output: {
    filename: 'index.[hash:8].js',
    library: 'someLibName',
    libraryTarget: 'umd',
  }
}
```

**debug**

only for `production` mode

```js
{
  debug: true,
}
```

**loaders**

```js
{
  loaders: [
    {
      test: /\.(png|jpg|gif)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      ],
    },
  ],
}
```

**sourceMap**

```js
{
  sourceMap: false, // always `true` in `development` mode
}
```

**targets**

only for `production` mode

```js
{
  targets: { ios: 10 },
}
```

**report**

only for `production` mode

```js
{
  report: true,
}
```

**injectScript**

```js
{
  injectScript: false,
}
```

**env**

```js
{
  env: 'development',
}
```

## Default Config

- Loaders
  - babel-loader
  - style-loader
  - css-loader
  - less-loader
  - svg-inline-loader
- Template DOM: `<div id="root"></div>`
- Output directory: `dist`
- Output files
  - index.js
  - index.js.map
  - index.html
- Externals umd url: `https://unpkg.com/${packageName}`
- CSS modules: `[name].module.css`

## License

MIT

## Relevance

Falco peregrinus
