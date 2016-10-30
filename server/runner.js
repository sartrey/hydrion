const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const assist = require('./assist.js')
const config = require('./config.js')

function loadCommands () {
  var dir = path.join(process.env.HOME, '.electron')
  if (!assist.isPathExists(dir)) {
    fs.mkdirSync(dir)
  }

  var p_cmdset = path.join(dir, 'cmdset.json')
  console.log('load cmdset', p_cmdset)
  try {
    return JSON.parse(fs.readFileSync(p_cmdset, 'utf8'))
  } catch (error) {
    console.log('fail to load cmdset, try to rewrite one')
    fs.writeFileSync(p_cmdset, JSON.stringify([], null, 2), 'utf8')
    return []
  }
}

module.exports = function createRunner() {
  return new Runner(loadCommands())
}

function Runner(commands) {
  if (Array.isArray(commands)) {
    this.commands = []
  } else {
    this.commands = commands.map(e => {
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
    var command = this.commands.find(e => e.name === name)
    if (command) {
      if (command.host === 'electron') {
        if (config.host.electron) {
          child_process.execSync(
            'electron ' + command.exec, 
            { cwd: config.host.electron }
          )
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
      // todo: refactor, not use name
      if (config.flag.execWhenLinkNotFound) {
        child_process.execSync(name)
        return { state: true, reply: 'command invoked' }
      } 
    }
    return { state: false, error: 'command not found' }
  }
}