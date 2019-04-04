const falco = require('../')

const js = `
import isarray from 'isarray'
console.log(isarray([]))
`;

(async () => {
  try {
    const { codes } = await falco({
      sourceMap: false,
      entry: { js },
    })

    global.console.log(codes)
  } catch (e) {
    global.console.error(e)
  }
})()
