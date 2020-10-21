// var schedule = require('node-schedule');
var _db = require('../database/mongo_db.js')
var menu = require('../telegram/menu.js')
var dico = require("../custo/dico.js")
var massMessages = require("../admin/massMessages.js")
var bulkMessagesAdmin = this



module.exports.deleteMessageText = function(msg, id) {
  _db.get('bulkMessages', "").then(function(snapshot) {
    snapshot.list.splice(id, 1)

    _db.set('bulkMessages', "", "list", snapshot.list, false).then(function(result) {

      bulkMessagesAdmin.getList(msg)
    })
  })
}
module.exports.confirmBulkMessage = function(msg, id) {
  _db.get('bulkMessages', "").then(function(snapshot) {
    console.log("snapshot", snapshot)
    massMessages.sendMessage(msg, snapshot.list[id].val, "bulk_message_" + snapshot.list[id].timestamp)
  })
}
module.exports.sendBulkMessageText = function(msg, id) {
  _db.get('bulkMessages', "").then(function(snapshot) {


    var _markup = []
    _markup.push([{
      text: '👨‍✈️ DELETE ' + (Number(id) + 1),
      callback_data: 'DELETE BULK MESSAGE TEXT_' + Number(id)
    }, {
      text: '👨‍✈️ CONFIRM ' + (Number(id) + 1),
      callback_data: 'CONFIRM BULK MESSAGE TEXT_' + Number(id)
    }])
    _markup.push([{
        text: '👨‍✈️Dashboard ',
        callback_data: 'GET ADMIN DASHBOARD'
      }
      // ,{
      //   text: '👨‍✈️Refresh Round ' + i,
      //   callback_data: 'REFRESH DASHBOARD_' + i
      // }
    ])
    var options = {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({
        inline_keyboard: _markup
      })

    };
    bot.sendMessage(msg.chat.id, snapshot.list[id].val, options)

  })
}
module.exports.getList = function(msg) {
  var _markup = []
  _db.get('bulkMessages', "").then(function(snapshot) {

    var result = "List of messages randomly presented on chat :\n\n"

    if (snapshot === {} || snapshot.list === undefined)
      result = "There is no message yet added; create one ;)"
    else {
      for (var i = 0; i < snapshot.list.length; i++) {
        result += "MESSAGE " + (i + 1) + "\n"
        result += snapshot.list[i].val + "\n\n"

        _markup.push([{
          text: '👨‍✈️ DELETE ' + (i + 1),
          callback_data: 'DELETE BULK MESSAGE TEXT_' + i
        }, {
          text: '👨‍✈️ SEND ' + (i + 1),
          callback_data: 'SEND BULK MESSAGE TEXT_' + i
        }])
      }
    }


    _markup.push([{
        text: '👨‍✈️ NEW MESSAGE',
        callback_data: 'CREATE A NEW BULK MSG'
      }
      // ,{
      //   text: '👨‍✈️ NEW IMG',
      //   callback_data: 'CREATE A NEW MESSAGE IMG'
      // }
    ])
    _markup.push([{
        text: '👨‍✈️Dashboard ',
        callback_data: 'GET ADMIN DASHBOARD'
      }
      // ,{
      //   text: '👨‍✈️Refresh Round ' + i,
      //   callback_data: 'REFRESH DASHBOARD_' + i
      // }
    ])

    var options = {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({
        inline_keyboard: _markup
      })

    };
    bot.sendMessage(msg.chat.id, result, options)
  })
}
module.exports.createNewMessageEntry = function(msg) {
  _db.get('bulkMessages', "").then(function(snapshot) {
    if (snapshot.list === undefined || snapshot.list.length === undefined) {
      snapshot.list = []
    }
    snapshot.list.push({
      val: msg.text,
      type: "text",
      timestamp: new Date().getTime()
    })
    _db.set('bulkMessages', "", "list", snapshot.list, false).then(function(result) {

      bulkMessagesAdmin.getList(msg)
    })
  })
}
module.exports.createNewMessage = function(msg, type) {
  var _ad = dico.getWordLang("EN", "ad", menu.getLangMenu)

  if (type === "text") {
    _db.set('users_participating_' + _AD_ROUND, msg.chat.id, null, {
      // edit: false,
      type: "admin_create_message_bulk_text"
    }, false).then(function() {
      var _txt = "Type your message.\nYou can use HTML markdown: https://core.telegram.org/bots/api#html-style\n"

      var _markup = []
      // _markup.push([{
      //   text: _ad.btn_cancel,
      //   callback_data: 'SET AD INFO'
      // }])


      var options = {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
          inline_keyboard: _markup
        })

      };
      bot.sendMessage(msg.chat.id, _txt, options);



    })
  }
}