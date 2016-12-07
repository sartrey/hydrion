const fs = require('fs')
const path = require('path')

const assist = require('./assist.js')

const config = {
  load: false,
  host: {},
  flag: {
    execWhenHostNotFound: true,
    execWhenLinkNotFound: true
  }
}

function loadConfig () {
  // use cache config
  if (config.load) return config

  // load config
  var root = assist.getDeployRoot()
  var p_config = path.join(root, 'config.json')
  console.log('load config', p_config)
  try {
    var o = JSON.parse(fs.readFileSync(p_config, 'utf8'))
    config.host = o.host
    config.flag = o.flag
    config.load = true
  } catch (error) {
    console.log('fail to load config, try to rewrite one')
    fs.writeFileSync(p_config, JSON.stringify(config, null, 2), 'utf8')
  }
  return config
}

module.exports = loadConfig()
