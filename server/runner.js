const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const {
  shell
} = require('electron')

const assist = require('./assist.js')
const config = require('./config.js')

function loadCommands () {
  var root = assist.getDeployRoot()
  var p_cmdset = path.join(root, 'cmdset.json')
  console.log('load cmdset', p_cmdset)
  try {
    return JSON.parse(fs.readFileSync(p_cmdset, 'utf8'))
  } catch (error) {
    console.log('fail to load cmdset, try to rewrite one')
    console.log(error)
    fs.writeFileSync(p_cmdset, JSON.stringify([], null, 2), 'utf8')
    return []
  }
}

module.exports = function createRunner() {
  return new Runner(loadCommands())
}

function Runner(commands) {
  if (!Array.isArray(commands)) {
    this.commands = []
  } else {
    this.commands = commands.map(function (e) {
      return {
        name: e.name,
        host: e.host,
        exec: e.exec
      }
    })
  }
}

Runner.prototype = {
  constructor: Runner,

  // todo: support param
  invoke: function (name, param) {
    var command = this.commands.find(function (e) {
      return e.name === name
    })
    if (command) {
      if (command.host === 'electron') {
        if (config.host.electron) {
          console.log(config.host.electron + ' ' + command.exec)
          child_process.exec(config.host.electron + ' ' + command.exec)
          return { state: true, reply: 'command invoked' }
        } else {
          return { state: false, error: 'electron not found' }
        }
      } else {
        if (config.flag.execWhenHostNotFound) {
          child_process.execSync(command.exec)
          return { state: true, reply: 'command invoked' }
        } else {
          return { state: false, error: 'host not found' }
        }
      }
    } else {
      if (config.flag.execWhenLinkNotFound) {
        shell.openExternal(name, function (error) {
          console.log(error)
        })
        return { state: true, reply: 'command invoked' }
      }
    }
    return { state: false, error: 'command not found' }
  }
}
