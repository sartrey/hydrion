const path = require('path')
const {
  app,
  globalShortcut
} = require('electron')

const config = require('./server/config.js')
const router = require('./server/router.js')([
  { name: 'startup', only: true, path: path.join(__dirname, 'client/startup') },
  { name: 'applist', only: true, path: path.join(__dirname, 'client/applist') },
])
const runner = require('./server/runner.js')()

app.on('ready', () => {
  // init global api
  global.epii = { router, runner }

  // register global shortcut
  var result = globalShortcut.register('Super+Enter', function () {
    router.routeTo('startup')
  })
  if (!result) {
    console.log('failed to register global shortcut')
  }

  // todo: register tray
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  // show startup view
  router.routeTo('startup')
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
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
