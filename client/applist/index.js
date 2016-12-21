const {
  shell,
  remote
} = require('electron')

window.$ = require('../../vendor/js/jquery.min.js')

$(document).ready(function () {
  var bridge = remote.getGlobal('epii')

  $('#btn-logo').dblclick(function (event) {
    shell.openExternal('https://github.com/sartrey/hydrion')
    remote.getCurrentWindow().close()
  })

  $('#btn-exit').click(function (event) {
    remote.getCurrentWindow().close()
  })
})
