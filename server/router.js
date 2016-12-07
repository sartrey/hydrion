const path = require('path')
const {BrowserWindow} = require('electron')

function createWindow (define, source, binder) {
  var window = new BrowserWindow(define)
  window.loadURL(source)
  if (binder && typeof binder === 'function') {
    try {
      binder(window)
    } catch (error) {
      console.error(error)
    }
  }
  return window
}

module.exports = function createRouter(routes) {
  return new Router(routes)
}

function Router(routes) {
  this.routes = routes.map(e => {
    return {
      name: e.name,
      path: e.path,
      only: e.only,
      hwnd: []
    }
  })
}

Router.prototype = {
  constructor: Router,

  routeTo: function (name) {
    var route = this.routes.find(e => e.name === name)
    if (route) {
      if (route.only && route.hwnd.length > 0) {
        return route.hwnd[0]
      }
      var meta = require(path.join(route.path, 'index.meta.js'))
      var window = createWindow(
        meta.define,
        'file://' + path.join(route.path, 'index.html'),
        meta.binder
      )
      window.on('closed', () => {
        route.hwnd.splice(route.hwnd.indexOf(window), 1)
      })
      return window
    }
    return null
  },

  closeView: function () {

  }
}
