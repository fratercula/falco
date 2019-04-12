module.exports = (name) => {
  const splited = name.split('/')
  if (!name.includes('@')) {
    return splited[0]
  }
  return splited.slice(0, 2).join('/')
}
