const { tmpdir } = require('os')
const { join } = require('path')

const JS_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']
const CSS_EXTENSIONS = ['css', 'less']
const OTHER_EXTENSIONS = ['vue', 'json']

module.exports.TMP_DIR = join(tmpdir(), 'FALCO')

module.exports.JS_EXTENSIONS = JS_EXTENSIONS

module.exports.EXTENSIONS = new RegExp(`\\.(${[...JS_EXTENSIONS, ...CSS_EXTENSIONS, ...OTHER_EXTENSIONS].join('|')})$`)

module.exports.REGEX = {
  import: /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*/g,
  package: /["|'](.*?)['|"]/,
  require: /require\s*\(['"`][^`"']+?[`'"]\)/g,
  '@import': /@import\s*['"`]([^`"']+?)[`'"];/g,
  comments: /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm,
  resolve: /(?:(?:Cannot resolve module)|(?:Can't resolve)) '([@\w/.-]+)' in/,
}

module.exports.PACKAGE = `{
  "private": true,
  "name": "falco",
  "version": "0.0.0"
}`

module.exports.HTML = `<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<title> Falco </title>
</head>
<body>
<div id="root"></div>
</body>
</html>
`

module.exports.UNPKG = 'https://unpkg.com'

module.exports.OUTPUT = 'output.js'

module.exports.BODY_TAG = '</body>'
