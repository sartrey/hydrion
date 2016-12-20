const {
  shell,
  remote
} = require('electron')

window.$ = require('jquery')

const hints = {
  'how-to-invoke': 'hint: press <enter> to invoke',
  'invalid-input': 'halt: invalid command',
  'invoke-done': 'done: command invoke done',
  'invoke-halt': 'halt: failed to invoke command'
}

function VIEW_updateHint (text, more) {
  $('.label .hint').text(text + ',' + more)
}

function VIEW_updateStat () {
  var count = $('.input').val().length
  $('.label .stat').text(count + '/1024')
}

$(document).ready(function () {
  var bridge = remote.getGlobal('epii')

  VIEW_updateHint(hints['how-to-invoke'])
  VIEW_updateStat()

  $('.input').focus()
  $('.input').keyup(function (event) {
    VIEW_updateHint(hints['how-to-invoke'])
    VIEW_updateStat()
    if (event.which === 13) {
      $('.input').blur()
      var command = $('.input').val()
      if (!/[a-zA-Z\:\-\.]+/.test(command)) {
        return VIEW_updateHint(hints['invalid-input'])
      }
      var result = bridge.runner.invoke(command)
      if (result.state) {
        VIEW_updateHint(hints['invoke-done'])
      } else {
        VIEW_updateHint(hints['invoke-halt'], result.error)
      }
    }
  })

  $('#btn-logo').dblclick(function (event) {
    shell.openExternal('https://github.com/sartrey/hydrion')
    remote.getCurrentWindow().close()
  })

  $('#btn-close').click(function (event) {
    remote.getCurrentWindow().close()
  })
})
