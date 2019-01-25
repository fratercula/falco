module.exports.WORKING_DIR = '.__FALCO__'

module.exports.BASE_DIR = process.cwd()

module.exports.EXTENSIONS = /\.(js|css|less)$/

module.exports.EXTERNALS = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-router-dom': 'ReactRouterDOM',
}
