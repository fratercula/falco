module.exports = {
  import: /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*/g,
  package: /["|'](.*?)['|"]/,
  require: /require\s*\(['"`][^`"']+?[`'"]\)/g,
}
