"use strict";
var _db = require('../database/mongo_db.js')
var menu = require('../telegram/menu.js')
var helper_msg = require('../admin/helper_msg.js')

module.exports.setAdStatus = function(status) {
  return _db.set('ad', _AD_ROUND, 'status', status, true)
}

module.exports.getMetrics = function(msg, _round, _ad_status) {


  _db.get('metrics', _round).then(function(snapshot) {

    // console.log("GET METRICS",snapshot)
    var _row = snapshot
    if (_row === null)
      return



    var _txt = helper_msg.getMetricsTxt(_row, _ad_status)
    var _markup = []


    _markup.push([{
        text: '📝 Update Round ' + _round,
        callback_data: 'UPDATE DATABASE_' + _round
      },
      {
        text: '📝 Download Round ' + _round,
        callback_data: 'DOWNLOAD DATABASE_' + _round
      }

    ])


    _markup.push(_menu)

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
global._underInvestigation = false;
global._roundInvestigation = false
module.exports.getIdToInvestigate = function(msg, _round) {
  _underInvestigation = true
  _roundInvestigation = _round
  bot.sendMessage(msg.chat.id, "Please type the user id. User id is the last digit part of user referral link after start=")
}
module.exports.getInfoFromId = function(msg) {

  var _promises = []
  if (!isNaN(msg.text)) {

    _promises.push(_db.get('users_participating_' + _roundInvestigation, msg.text))
  } else if (msg.text.indexOf("@") === 0) {
    //We have an username
    var _name = msg.text.substring(1, msg.text.length)

    _promises.push(_db.find('users_participating_' + _roundInvestigation, {
      username: _name
    }, {}, false))
  }

  Promise.all(_promises).then(function(results) {


    if (results === undefined || results === null)
      bot.sendMessage(msg.chat.id, "No user founded with this id for Round " + _roundInvestigation);
    else {
      var _result = results[0]
      if (_result[0] !== undefined)
        _result = _result[0]

      var _keyboard = helper_msg.getKeyboardButtons(msg, _result.lang)


      var options = helper_msg.getKeyboardButtonsOptions(_keyboard)
      bot.sendMessage(msg.chat.id, "Find hereafter the submission datas of the user :" + msg.text, options).then(function() {
        menu.setSubmissionByDatas(msg, _result, true, null)
        menu.getAdBalance(msg, _result.id, _result)
      })
    }
  })
}


module.exports.getDashBoard = function(msg) {
  var _markup = []

  var result = "This is a global dashboard."


  _markup.push([{
    text: '👨‍✈️ BULK MESSAGES',
    callback_data: 'GET BULK MESSAGES LIST'
  }])

  _markup.push(_menu)

  var options = {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: JSON.stringify({
      inline_keyboard: _markup
    })

  };
  _db.set('users_participating_' + _AD_ROUND, msg.chat.id, null, {
    // edit: false,
    type: null
  }, false).then(function() {
    bot.sendMessage(msg.chat.id, result, options)
  })
}

// module.export.loadUserById = function(){
//
// }