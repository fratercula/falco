module.exports = (name: string) => {
  const [first, second] = name.split('/')
  if (first !== '@') {
    return first
  }
  return `${first}/${second}`
}
