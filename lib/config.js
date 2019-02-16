const { join } = require('path')

const CACHE_FOLDER = '.__FALCO__'

module.exports.CACHE_FOLDER = CACHE_FOLDER

module.exports.BASE_DIR = join(process.cwd(), CACHE_FOLDER)

module.exports.EXTENSIONS = /\.(js|css|less|vue|json)$/

module.exports.REGEX = {
  import: /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*/g,
  package: /["|'](.*?)['|"]/,
  require: /require\s*\(['"`][^`"']+?[`'"]\)/g,
  '@import': /@import\s*['"`]([^`"']+?)[`'"];/g,
  comments: /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm,
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
