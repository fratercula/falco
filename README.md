# Falco

JavaScript Runner. run and build codes with `zero` configuration

![falco](https://user-images.githubusercontent.com/2193211/55216793-afa54180-5238-11e9-9cda-f1c702dcd97b.gif)

## Install

```js
$ npm i @fratercula/falco
```

## Usage

```js
const falco = require('@fratercula/falco')

// see `options` below for more infomation
const options = {
  entry: {
    main: 'index.js',
    path: 'path/to/build',
  },
  registry: 'https://registry.npm.taobao.org',
  externals: {
    // ...
  },
  template: path.join(process.cwd(), 'index.html'),
  port: 8000,
  mode: 'development',
  esModules: true,
  cssModule: false,
}

;(async () => {
  try {
    const {
      codes,
      dependencies,
      template,
      mode,
    } = await falco(options)
    // mode: `development` or `production`
    // template: html template, for production mode
    // codes: converted code, and sourceMap
    // dependencies: package dependencies
  } catch (e) {
    console.log(e)
  }
})()
```

## CLI

install

```js
$ npm i @fratercula/falco -g
```

use

```bash
$ falco -p 2222 -d -r https://registry.npm.taobao.org -c -m vue.js -t template.html -o lib

# p: server port, for development mode. default 2222
# d: set development mode
# r: set npm registry
# m: build entry. default `index.js`
# c: use local config: `falco.config.js`
# t: set html template. default is `index.html`
# o: set output path, default is `dist`
```

## Options

### entry

codes entry, `object` or `array`, required

```js
// basic
{
  entry: {
    js: 'console.log(1)',
    type: 'ts', // `js/jsx` or `ts/tsx`
    css: 'body { color: red }',
  },
}

// multiple
{
  entry: [{ js, css }, { js: js1, css: css1 }],
}

// directory
{
  entry: {
    main: 'index.js', // main entry
    path: '/path/to/your/codes/directory',
  },
}
```

### externals

modules external config, default `[]`. you can set external `umd` url

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
      // use `https://unpkg.com/vue`
      name: 'vue',
      root: 'Vue',
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

### packages

set npm install packages version. packages list here will be installed, ignore `externals`

```js
{
  packages: {
    react: '^13.5.9',
  },
}
```

### registry

set npm registry

```js
{
  registry: 'https://registry.npm.taobao.org',
}
```

### esModules

[@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules) option, default is `true`

```js
{
  esModules: true, // always `true` when mode is `development`
}
```

### cssModule

[css module](https://github.com/css-modules/css-modules), default is `false`

```js
{
  cssModule: false,
}
```

### template

set output `index.html` template

```js
{
  template: 'path/to/html',
}
```

### tmpDir

set temp files directory, default is `os.tmpDir()`

```js
{
  tmpDir: path.join(__dirname, 'temp'),
}
```

### cache

set if empty `node_modules` before `npm install`, set `false` will remove. default is `true`

```js
{
  cache: false,
}
```

### output

webpack [output](https://webpack.js.org/configuration/output/) option
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

### vue

`falco` will automatic detection of using `vue` normally, except code `circular dependency`

```js
{
  vue: false, // not vue
}
```

### debug

show `bable-loader` debug infomation, default is `false`

```js
{
  debug: true, // only for `production` mode
}
```

### sourceMap

enable `sourceMap`, default is `true`

```js
{
  sourceMap: false, // always `true` in `development` mode
}
```

### targets

set browsers targets, default is `{}`

```js
{
  targets: { ios: 10 }, // only for `production` mode
}
```

### report

use [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer), default `false`

```js
{
  report: true, // only for `production` mode
}
```

## Other

- support `ES6+/React/Vue/TypeScript/Less`
- template set default DOM `<div id="root"></div>`
- css preprocessor only support `less`
- file extension supports `js/jsx/ts/tsx/css/less/vue/json`
- default output files name are `index.js`, `index.js.map` and `index.html`
- default output directory is `dist`
- default externals umd url is `https://unpkg.com/${packageName}`
- not support webpack multiple entry

## License

MIT

## Relevance

Falco peregrinus
