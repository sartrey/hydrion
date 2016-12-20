const fs = require('fs')
const path = require('path')

module.exports = {
  isPathExists,
  getDeployRoot
}

function isPathExists (p) {
  try {
    fs.accessSync(p)
    return true
  } catch (error) {
    return false
  }
}

function getDeployRoot() {
  var dir = path.join(process.env.HOME, '.hydrion')
  if (!isPathExists(dir)) {
    fs.mkdirSync(dir)
  }
  return dir
}
