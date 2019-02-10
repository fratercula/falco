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
    const { code, sourceMap, dependencies } = await falco(options)
    // code: converted code / string
    // sourceMap: filename is `output.js.map` / string
    // dependencies: package dependence / array
  } catch (e) {
    console.log(e)
  }
})()
```

### Options

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

example:

```js
{
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
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

## License

MIT

## Relevance

Falco peregrinus
