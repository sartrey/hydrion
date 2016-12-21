const path = require('path')
const {
  BrowserWindow
} = require('electron')

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
  this.routes = routes.map(function (route) {
    return {
      name: route.name,
      path: route.path,
      only: route.only,
      hwnd: []
    }
  })
}

Router.prototype = {
  constructor: Router,

  routeTo: function (name) {
    var route = this.routes.find(function (e) {
      return e.name === name
    })
    if (route) {
      var window
      if (route.only && route.hwnd.length > 0) {
        window = route.hwnd[0]
        window.focus()
        return window
      }
      var meta = require(path.join(route.path, 'index.meta.js'))
      window = createWindow(
        meta.define,
        'file://' + path.join(route.path, 'index.html'),
        meta.binder
      )
      window.on('closed', function () {
        route.hwnd.splice(route.hwnd.indexOf(window), 1)
      })
      route.hwnd.push(window)
      return window
    }
  },

  closeView: function () {

  }
}
