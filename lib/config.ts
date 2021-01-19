const { tmpdir } = require('os')
const { join } = require('path')

module.exports.TMP_DIR = join(tmpdir(), 'falco')
