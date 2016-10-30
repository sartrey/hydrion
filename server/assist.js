const fs = require('fs')

module.exports = {
  isPathExists
}

function isPathExists (p) {
  try {
    fs.accessSync(p)
    return true
  } catch (error) {
    return false
  }
}