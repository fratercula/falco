module.exports.WORKING_DIR = '.__FALCO__'

module.exports.BASE_DIR = process.cwd()

module.exports.EXTENSIONS = /\.(js|css|less|scss)$/

module.exports.REGEX = {
  import: /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*/g,
  package: /["|'](.*?)['|"]/,
  require: /require\s*\(['"`][^`"']+?[`'"]\)/g,
  '@import': /@import\s*['"`]([^`"']+?)[`'"];/g,
}
