"use strict";

var dico = require("../custo/dico.js")

module.exports.getDataValidText = function(data, _require) {

  if (!_require.is_pow_link) {
    if (!_require.redirect_to) {
      return "✅ " + _require.text_valid + "<b>: " + data[_require.type] + " </b>"
    } else {
      return "✅ " + _require.text_valid + "<b>: " + data[_require.type].join('\n') + " </b>"
    }
  } else {
    if (!_require.redirect_to) {
      return "✅ <a href=\"" + data[_require.type] + "\">" + _require.text_valid + "</a>"
    }
  }


}

module.exports.getKeyboardButtons = function(msg, lang) {

  var _ad = dico.getWordLang(lang, "ad")
  var _keyboard = []

  _keyboard.push([{
      text: _ad.btn_home
    },
    {
      text: _ad.btn_balance
    }
  ])

  _keyboard.push([{
      text: _ad.btn_deposit
    },
    {
      text: _ad.btn_withdraw
    }
  ])

  if (_LANG_LENGTH > 1) {
    _keyboard.push([{
        text: _ad.btn_info
      },

      // {
      //   text: _ad.btn_rules
      // },
      {
        text: _ad.btn_lang
      },
    ])
  } else {
    _keyboard.push([{
        text: _ad.btn_twitter
      },

      {
        text: _ad.btn_info
      },

    ])
  }



  return _keyboard
}
module.exports.getKeyboardButtonsOptions = function(_keyboard) {
  return {
    parse_mode: "HTML",
    disable_web_page_preview: true,

    reply_markup: JSON.stringify({

      keyboard: _keyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    })

  }
}

module.exports.getReferralPhrase = function(msg, id, REF_LIMIT, AMOUNT_REF, AMOUNT_REF_DOLLAR, lang) {
  return ""



}