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
    const { js, sourceMap, dependencies } = await falco(options)
    // js: converted code / string
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

example

```js
// basic
{
  js: 'console.log(1)',
  css: 'body { color: red }'
}

// multiple
[{ js, css }, { js1, css1 }]

// directory
{
  main: 'index.js', // main entry
  path: '/path/to/your/codes/directory'
}

// directory data
const { tree } = require('@fratercula/falco')
const treeData = tree('path/to/codes/directory')

{
  main: 'index.js',
  data: treeData,
}
```

### moduleRules

custom webpack loaders, type is `array`, default is `[]`

example:

```js
[
  {
    test: /\.vue$/,
    loader: path.resolve('../loader/path'),
    options: vueLoaderConfig
  }
]
```

### externals

same as webpack externals config, type is `object`, default `{}`

built-in:

```js
{
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-router-dom': 'ReactRouterDOM',
}
```

### registry

set npm registry

example:

```js
registry: 'https://registry.npm.taobao.org'
```

### other options

| name | description | type | default |
| --- | --- | --- | --- |
| cache | cache npm install files | boolean | true |
| esModules | [@babel/preset-env option](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules) | boolean | true |
| compress | code compress | boolean | true |
| cssModule | [css module](https://github.com/css-modules/css-modules) | boolean | false |
| cssSourceMap | css sourceMap | boolean | false |
| jsSourceMap | js sourceMap | boolean | false |

## License

MIT

## Relevance

Falco peregrinus
