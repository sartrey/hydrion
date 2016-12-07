const path = require('path')
const {app} = require('electron')

const config = require('./server/config.js')
const router = require('./server/router.js')([
  { name: 'startup', only: true, path: path.join(__dirname, 'client/startup') },
  { name: 'applist', only: true, path: path.join(__dirname, 'client/applist') },
  { name: 'appedit', only: false, path: path.join(__dirname, 'client/appedit') }
])
const runner = require('./server/runner.js')()

app.on('ready', () => {
  // todo: register global shortcut
  // todo: ok then hide dock icon
  // todo: fail then register tray
  // todo: ok then hide dock icon
  if (process.platform === 'darwin') {
    // app.dock.hide()
  }

  router.routeTo('startup')
  global.epii = {
    router, runner
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// only for macOS
app.on('activate', () => {
  router.routeTo('startup')
})
