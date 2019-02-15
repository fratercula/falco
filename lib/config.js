module.exports.WORKING_DIR = '.__FALCO__'

module.exports.BASE_DIR = process.cwd()

module.exports.EXTENSIONS = /\.(js|css|less|scss)$/

module.exports.REGEX = {
  import: /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*/g,
  package: /["|'](.*?)['|"]/,
  require: /require\s*\(['"`][^`"']+?[`'"]\)/g,
  '@import': /@import\s*['"`]([^`"']+?)[`'"];/g,
  comments: /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm,
}

module.exports.PACKAGE = `{
  "private": true,
  "name": "temp",
  "version": "0.0.0",
  "description": "JavaScript Transcoder",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/fratercula/falco.git"
  },
  "license": "MIT"
}`

module.exports.HTML = `<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<title> Falco </title>
</head>
<body>
<div id="root"></div>
$script$
<script src="./output.js"></script>
</body>
</html>
`
