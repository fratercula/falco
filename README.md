# Falco

JavaScript Transcoder

## Install

```js
$ npm i @fratercula/falco
```

## Usage

```js
const falco = require('@fratercula/falco')

const options = {
  //...
}

;(async () => {
  try {
    const { js, sourceMap, dependencies } = falco(options)
  } catch (e) {
    console.log(e)
  }
})()
```

### Options

| name | description | type | default | required | example
| --- | --- | --- | --- | --- | ---
| entry | codes to be converted | object / array | - | YES | { js: 'console.log(1)', css: 'body { color: red }' } <br /> [{ js, css }, { js, css }] <br /> { main: 'index.js', path: '/path/to/your/codes/directory' } |
| moduleRules | custom webpack loaders | array | [] | - | { test: /\.vue$/, loader: path.resolve('../loader/path'), options: vueLoaderConfig } |
| externals | same as webpack externals config, built-in { react: 'React', 'react-dom': 'ReactDOM', 'react-router-dom': 'ReactRouterDOM' } | object | {} | - | - |
| cache | cache npm install files | boolean | true | - | - |
| esModules | [@babel/preset-env option](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules) | boolean | true | - | - |
| compress | code compress | boolean | true | - | - |
| cssModule | [css module](https://github.com/css-modules/css-modules) | boolean | false | - | - |
| cssSourceMap | css sourceMap | boolean | false | - | - |
| jsSourceMap | js sourceMap | boolean | false | - | - |

## License

MIT

## Relevance

Falco peregrinus
