"use strict";

var fs = require('fs');
// var Captcha = require('node-captcha-generator');
var dico = require("../custo/dico.js")
var _db = require('../database/mongo_db.js')
var helper = this
var menu = require('../telegram/menu.js')
var exporting_v2 = require('../admin/data_exports_v2.js')

var ava = require('../ava/wallets.js')
Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

/********/
global._hasStarted = true
global._totalParticipants = 0
global.adStatus = true;

module.exports.numberWithCommas = function(x, digits) {

  if (digits === undefined || digits === null)
    digits = 2;

  console.log('x', x)
  var res = x.toFixed(digits)

  var split = res.split('.')

  return split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + split[1];
}

module.exports.noCtrl = function(msg, require) {
  return new Promise(function(resolve, reject) {
    resolve(true)
  })
}
module.exports.avaxWallet = function(msg, require) {
  return new Promise(function(resolve, reject) {

    if (msg.text.toLowerCase().indexOf('x-avax1') === 0) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}


module.exports.isTwitterHandle = function(msg) {
  return new Promise(function(resolve, reject) {

    if (msg.text.indexOf("@") === 0) {
      resolve(true)
    } else {
      resolve(false)
    }
  })

}
module.exports.cleanTwitterHandle = function(msg) {
  if (msg.text.indexOf("@") === 0) {
    return msg.text.substring(1, msg.text.length)
  } else {
    return msg.text
  }
}
module.exports.cleanTwitterHandleDiscord = function(handle) {
  if (handle.indexOf("@") === 0) {
    return handle.substring(1, handle.length)
  } else {
    return handle
  }
}
module.exports.validateEmail = function(msg, require) {
  return new Promise(function(resolve, reject) {
    function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    console.log("msg.text.toLowerCase()", msg.text.toLowerCase())
    if (!validateEmail(msg.text.toLowerCase())) {
      resolve(false)
    } else {
      resolve(true)
    }
  })
}

module.exports.checkDuplicateEntry = function(msg, type, round) {
  return new Promise(function(resolve, reject) {

    if (_AD_REQUIREMENTS[type].allow_duplicate !== undefined && _AD_REQUIREMENTS[type].allow_duplicate === true)
      resolve(false)

    var _query = []
    var _tmp = {}
    _tmp[type] = msg.text
    _query.push(_tmp)
    var _tmp2 = {}
    _tmp2._id = {
      $ne: msg.chat.id
    }
    _query.push(_tmp2)
    var _queryALL = {
      $and: _query
    }

    _db.find("users_participating_" + round, _queryALL, {}, true).then(function(result) {
      //return false if there is not duplicate entries
      //return true if there is a duplicate entry
      if (result === 0)
        resolve(false)
      else
        resolve(true)
    })

  })
}
module.exports.setRowCalc = function(_row) {

  //_row._CRYPTO_SPEC_TEXT = _row._CRYPTO_SPEC_TEXT
  _row._AD_END_DATE = _row._AD_END_DATE
  _row._AMOUNT_SUBSCRIBE_DOLLAR = _row._AMOUNT_SUBSCRIBE_DOLLAR
  _row._AMOUNT_REF_DOLLAR = _row._AMOUNT_REF_DOLLAR
  _row._REF_LIMIT = _row._REF_LIMIT
  _row._AD_TOTAL_ALLOCATED_TOKENS = _row._AD_TOTAL_ALLOCATED_TOKENS
  _row._AD_TOKEN_MAX_USER = (_row._AMOUNT_SUBSCRIBE_DOLLAR + _row._AMOUNT_REF_DOLLAR) / _CRYPTO_TOKEN_UNIT_VALUE_DOL
  _row._AD_TOTAL_MAX_USERS = (_row._AD_TOTAL_ALLOCATED_TOKENS / _row._AD_TOKEN_MAX_USER) * _row._AD_MAX_PERCENT
  _row._AD_UNCAPPED = _row._AD_UNCAPPED;

  _row._AD_REQUIREMENTS = _row._AD_REQUIREMENTS;
  _row._AMOUNT_REF = _row._AMOUNT_REF_TOKENS
  _row._AMOUNT_SUBSCRIBE = _row._AMOUNT_SUBSCRIBE_TOKENS

  return _row
}
module.exports.checkRequirements = function(_row, REQUIREMENTS, isReport) {

  if (_row === undefined || _row === null)
    return false;

  var _check = true;
  for (var i in REQUIREMENTS) {
    if (REQUIREMENTS[i].required && !REQUIREMENTS[i].redirect_to &&
      !REQUIREMENTS[i].bounty &&
      (_row[REQUIREMENTS[i].type] === undefined ||
        _row[REQUIREMENTS[i].type] === null)) {

      if (isReport)
        errors[REQUIREMENTS[i].type]++

      console.log(REQUIREMENTS[i])
      _check = false
    }
  }


  return _check

}
module.exports.isAllRequirementsDone = function(_row, datas, bounty_value) {

  var REQUIREMENTS = datas._AD_REQUIREMENTS

  if (_row === undefined || _row === null)
    return 0;

  var amount = 0
  if (datas._AMOUNT_ALL_TASKS_TOKENS !== undefined)
    amount = datas._AMOUNT_ALL_TASKS_TOKENS
  if (bounty_value !== undefined)
    amount = bounty_value

  for (var i in REQUIREMENTS) {
    if (
      ((REQUIREMENTS[i].required && !REQUIREMENTS[i].redirect_to) || (REQUIREMENTS[i].bounty && REQUIREMENTS[i].bounty_token_value > 0))

      &&
      (_row[REQUIREMENTS[i].type] === undefined || _row[REQUIREMENTS[i].type] === null)) {

      // console.log(REQUIREMENTS[i].type)
      amount = 0
    }
  }


  return amount

}
module.exports.getBountyRequirements = function(_row, REQUIREMENTS, isReport) {
  if (_row === undefined || _row === null)
    return 0;

  var _calc = 0;
  for (var i in REQUIREMENTS) {

    // console.log(i , _row[REQUIREMENTS[i].type])
    if (REQUIREMENTS[i].bounty &&
      (!REQUIREMENTS[i].required && REQUIREMENTS[i].bounty) &&
      (_row[REQUIREMENTS[i].type] !== undefined && _row[REQUIREMENTS[i].type] !== null)) {

      // bounties[REQUIREMENTS[i].type]++

      _calc += REQUIREMENTS[i].bounty_token_value

    }

  }


  return _calc

}


module.exports.getRequirementText = function(msg, _required, lang) {
  console.log('"r"', _required)
  var _udicoAction = _dico.rounds[_AD_ROUND_SELECTED].actions[_required.type]
  var _require = _required
  if (_udicoAction.text_valid !== undefined)
    _require.text_valid = _udicoAction.text_valid
  if (_udicoAction.text_valid_long !== undefined)
    _require.text_valid_long = _udicoAction.text_valid_long
  if (_udicoAction.text_question !== undefined)
    _require.text_question = _udicoAction.text_question
  if (_udicoAction.text_rule !== undefined)
    _require.text_rule = _udicoAction.text_rule
  if (_udicoAction.btn_txt_join !== undefined)
    _require.btn_txt_join = _udicoAction.btn_txt_join
  if (_udicoAction.btn_txt !== undefined)
    _require.btn_txt = _udicoAction.btn_txt
  if (_udicoAction.check_invalid !== undefined)
    _require.check_invalid = _udicoAction.check_invalid
  if (_udicoAction.check_valid !== undefined)
    _require.check_valid = _udicoAction.check_valid

  return _require;
}


var timevar = [];

module.exports.checkSpam = function(_userid) {
  var isOk = true;
  var diff = 0;

  if (timevar[_userid] != undefined) {
    diff = new Date() / 1000 - timevar[_userid];

    if (diff < 1) {

      //bot.sendMessage(_userid,"Keep cool ;)")
      isOk = false;
    }
  }
  timevar[_userid] = new Date() / 1000;

  return isOk;
}

module.exports.isWhitelisted = function(msg, _row) {
  if (_row._AD_UNCAPPED.includes(msg))
    return true
  else {
    return false
  }
}

module.exports.isUrlFrom = function(msg, require) {
  return new Promise(function(resolve, reject) {
    if (msg.text.toLowerCase().indexOf('http') !== -1 &&
      msg.text.toLowerCase().indexOf(require.control_template.toLowerCase()) !== -1 &&
      msg.text.toLowerCase().trim() !== require.btn_url.toLowerCase().trim() &&
      msg.text.indexOf('skip') === -1
    ) {
      console.log("VALID")
      resolve(true)


    } else
      resolve(false)
  })
}

module.exports.sendMessageAfterSubmit = function(msg, _txtText, type, val, dbUpdate, myUserDb) {

  var _tmp = {
    // edit: true,
    type: false
  }
  _tmp[type] = val

  var optionsText = {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };



  console.log("_txtText", msg, _txtText, type, val, dbUpdate, myUserDb)
  if (dbUpdate !== undefined && dbUpdate === true) {

    _db.set('users_participating_' + _AD_ROUND, msg.chat.id, null, _tmp, true).then(function(myUser) {
      var _require = _AD_REQUIREMENTS[type]

      if (_require.bounty && !_require.required && _require.bounty_token_value > 0)
        _TOKEN_REMAINING -= _require.bounty_token_value

      exporting_v2.checkRemaining(_AD_ROUND)


      menu.setSubmissionByDatas(msg, _txtText, myUser, false)
    })
  } else {

    menu.setSubmissionByDatas(msg, _txtText, myUserDb, false)
  }
}


module.exports.isEmail = function(msg) {

  if (msg.text.toLowerCase().indexOf('@') !== -1

  ) {
    return true
  }
  return false
}
module.exports.validateERC20 = function(msg) {
  return new Promise(function(resolve, reject) {
    resolve(/^(0x){1}[0-9a-zA-Z]{40}$/i.test(msg.text));
  })
}
module.exports.validateNEO = function(msg) {
  return new Promise(function(resolve, reject) {
    resolve(/^A[0-9a-zA-Z]{33}$/i.test(msg.text));
  })
}

module.exports.getRandomNumber = function(min, max) {

  return Math.floor(Math.random() * (max - min + 1) + min);

}

module.exports.createNewUser = function(msg, match) {

  return new Promise(function(resolve, reject) {


    var resp = ""
    if (match !== null !== undefined && match !== null)
      resp = match.input.slice(7, match.input.length).trim()

    // console.log("MATCH",resp,resp.length)
    var _username = msg.chat.username
    if (_username === undefined || _username === null)
      _username = "N/A"

    var _tmp = {
      "id": msg.chat.id,
      "username": _username,
      "ad_status": adStatus,
      "has_father": true,
      "network": 'telegram'
    }
    if (_LANG_LENGTH === 1)
      _tmp.lang = _LANG_DEFAULT




    _db.set('users_participating_' + _AD_ROUND, msg.chat.id, null, _tmp, true).then((snapshotFather) => {


      _totalParticipants++
      msg.chat.network === 'telegram'

      _db.set('users', msg.chat.id, null, msg.chat, false)


      _db.find("wallets", {
        _id: msg.chat.id
      }, {}, true).then((rWallet) => {
        //return false if there is not duplicate entries
        //return true if there is a duplicate entry

        if (rWallet === 0) {
          ava.createWallets().then((cWallet) => {

            _db.set('wallets', msg.chat.id, null, cWallet, false).then(() => {
              _db.set('users_participating_' + _AD_ROUND, msg.chat.id, "tip", cWallet.xchain, true)
              resolve(snapshotFather)
            })


          })
        } else {
          _db.find("wallets", {
            _id: msg.chat.id
          }, {}, false).then((rWalletGet) => {
            _db.set('users_participating_' + _AD_ROUND, msg.chat.id, "tip", rWalletGet[0].xchain, true)
            resolve(snapshotFather)
          })

        }

      })


    })

  })
}

module.exports.createNewUserDiscord = function(msg) {

  return new Promise(function(resolve, reject) {
    _db.find('users_participating_' + _AD_ROUND, {
      _id: msg.author.id
    }, {}, true).then((x) => {
      if (x === 1) resolve({
        exists: true
      });

      // console.log("MATCH",resp,resp.length)
      var _username = msg.author.username
      if (_username === undefined || _username === null)
        _username = "N/A"


      var _tmp = {
        "id": msg.author.id,
        "username": _username,
        "network": 'discord'

      }
      msg.author.network === 'discord'

      _db.set('users_participating_' + _AD_ROUND, msg.author.id, null, _tmp, true).then(function(snapshotFather) {


        _totalParticipants++

        _db.set('users', msg.author.id, null, msg.author, false)


        _db.find("wallets", {
          _id: msg.author.id
        }, {}, true).then((rWallet) => {
          //return false if there is not duplicate entries
          //return true if there is a duplicate entry
          console.log('rWallet', rWallet)
          if (rWallet === 0) {
            ava.createWallets().then((cWallet) => {

              _db.set('wallets', msg.author.id, null, cWallet, false).then(() => {

                console.log("msg.author.id", msg.author.id, cWallet.xchain)
                _db.set('users_participating_' + _AD_ROUND, msg.author.id, "tip", cWallet.xchain, true)
                resolve(snapshotFather)
              })


            })
          } else {

            resolve(snapshotFather)

          }

        })


      })
    })
  })
}

// //
// module.exports.getUserLang = function(msg) {
//   return _db.get('users_participating_'+_roundInvestigation,msg.chat.id).then(function(myUser){
//   if (myUser !== undefined &&  myUser !== null &&
//     myUser.lang !== undefined &&
//     helper.isPrivate(msg)) {
//     return myUser.lang
//   } else {
//     return "EN"
//   }
// })
// }

module.exports.initUsersCount = function() {


  return _db.countUsers("users_participating_" + _AD_ROUND).then(function(result) {

    _db.set("ad", _AD_ROUND, "users", _totalParticipants, true).then(function(snapshot) {
      if (snapshot === null || snapshot.status === undefined || snapshot.status === null) {


        _db.set('ad', _AD_ROUND, 'status', true, false)
        adStatus = true
      } else {
        adStatus = snapshot.status
      }
    })
  })



}
module.exports.setUserLang = function(msg, myUser) {

  //  usersFIFO[msg.chat.id].lang = lang
  if (myUser.human_smiley === undefined || myUser.human_smiley !== "Passed!")
    helper.setHumanControlSmiley(msg, myUser.lang)
  else
    menu.setSubmissionByDatas(msg, null, myUser, false)

  _db.set('users_participating_' + _AD_ROUND, msg.chat.id, "lang", myUser.lang, false)


}

module.exports.isLang = function(msg) {
  for (var i = 0; i < _LANGS.length; i++) {

    for (var j in _LANGS[i]) {

      if (_LANGS[i][j].text === msg.text)
        return _LANGS[i][j].lang
    }

  }
  return false;
}


global._countUsersLoop = 0
module.exports.getUser = function(msg, match) {

  return new Promise(function(resolve, reject) {
    if (helper.isPrivate(msg)) {

      _db.get('users_participating_' + _AD_ROUND, msg.chat.id).then(function(myUser) {

        if (myUser !== undefined && myUser.lang !== undefined) {

          resolve(myUser)
        } else {
          _countUsersLoop++



          resolve(helper.createNewUser(msg, match))
        }


      })

      // } else {
      //   step()
    }
  })
}

module.exports.setHumanControlSmiley = function(msg, lang) {
  var _array = ["☂️", "🐸", "🐶", "🐝", "🦋", "🌈", "🍣", "🎖", "🚗", "💎", "🚀", "👽"]
  var _final = []
  var _tmpFinal = []
  var _tmpArr = []



  for (var i = 0; i < 9; i++) {
    var _rdm = helper.getRandomNumber(0, _array.length - 1);

    _tmpArr.push({
      text: _array[_rdm],
      callback_data: "CHECK HUMAN CONTROL SMILEY_" + _array[_rdm]
    })
    _tmpFinal.push(_array[_rdm])
    if ((i + 1) % 3 === 0) {
      _final.push(_tmpArr)
      _tmpArr = []
    }
    _array.splice(_rdm, 1)
  }
  var _rdm = helper.getRandomNumber(0, _tmpFinal.length - 1);
  //
  // usersFIFO[msg.chat.id].human_response = _tmpFinal[_rdm]


  var options = {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: JSON.stringify({
      inline_keyboard: _final
    })

  };

  _db.set('users_participating_' + _AD_ROUND, msg.chat.id, "human_response", _tmpFinal[_rdm], false)
    .then(function() {
      var _require = helper.getRequirementText(msg, _AD_REQUIREMENTS["human_smiley"], lang)


      bot.sendMessage(msg.chat.id, _require.text_question + _tmpFinal[_rdm], options)

    })


}

module.exports.checkHasBounty = function(_row, REQUIREMENTS) {

  if (_row === undefined || _row === null)
    return false;

  var _check = false;
  for (var i in REQUIREMENTS) {
    if (REQUIREMENTS[i].bounty && !REQUIREMENTS[i].bounty_token_value > 0)
      return true
  }
  return _check

}

module.exports.checkHumanControlSmiley = function(msg, smiley, human_response, lang, myUser) {

  var _require = helper.getRequirementText(msg, _AD_REQUIREMENTS["human_smiley"], lang)
  var _ad = dico.getWordLang(lang, "ad")


  if (smiley === human_response) {




    if (_require.check_valid_image !== undefined && _require.check_valid_image.indexOf(".gif") !== -1) {
      var image = __dirname + "/../img/" + _require.check_valid_image
      bot.sendDocument(msg.chat.id, image).then(function() {
        helper.sendMessageAfterSubmit(msg, null, "human_smiley", _require.check_valid, true, myUser)
      })
    } else if (_require.check_valid_image !== undefined && _require.check_valid_image.indexOf(".gif") === -1) {
      var image = __dirname + "/../img/" + _require.check_valid_image
      bot.sendPhoto(msg.chat.id, image).then(function() {
        helper.sendMessageAfterSubmit(msg, null, "human_smiley", _require.check_valid, true, myUser)
      })
    } else {
      helper.sendMessageAfterSubmit(msg, _require.text_valid_long, "human_smiley", _require.check_valid, true, myUser)
    }



  } else {

    if (myUser.smileyCount === undefined)
      myUser.smileyCount = 0

    myUser.smileyCount++

    var _chancesLeft = 3 - myUser.smileyCount
    var _chanceText = _ad.chances_start + " " + _chancesLeft + " " + _ad.chances_end_plurial
    if (_chancesLeft === 1 || _chancesLeft < 1)
      _chanceText = _ad.chances_start + " " + _chancesLeft + " " + _ad.chances_end_single

    console.log(_chanceText)
    if (_chancesLeft > 0) {
      _db.set('users_participating_' + _AD_ROUND, msg.chat.id, "smileyCount", myUser.smileyCount, true).then(function() {
        bot.sendMessage(msg.chat.id, _chanceText).then(function() {
          helper.setHumanControlSmiley(msg, myUser.lang)
        })
      })
    } else {
      _db.set('users_participating_' + _AD_ROUND, msg.chat.id, "invalid", true, true).then(function() {
        helper.sendMessageAfterSubmit(msg, _chanceText, "human_smiley", _require.check_invalid, false, myUser)
      })

    }
  }






}
// module.exports.setHumanControlCaptcha = function(msg) {
//
//
//   var c = new Captcha({
//     length: 3, // number length
//     size: { // output size
//       width: 100,
//       height: 50
//     }
//   });
//
//   c.save('captcha', function(err) {
//     usersFIFO[msg.chat.id].human_response = c.value
//
//     var image = __dirname + "/../captcha/" + c.value + ".bmp"
//
//     menu.setInfo(msg, "human_captcha", "")
//
//     _db.set('users_participating_' + _AD_ROUND, msg.chat.id, "human_response", c.value,true)
//       .then(function() {
//         bot.sendPhoto(msg.chat.id, image).then(function() {
//           fs.unlinkSync(image);
//
//         })
//
//       })
//   });
//
// }


module.exports.isAdmin = function(msg) {

  return _isAdmin(msg, myAdmins)

}
var _isAdmin = function(msg, array) {
  for (var i = 0; i < array.length; i++) {

    if ((msg.chat !== undefined && (array[i] === msg.chat.id || array[i] === msg.chat.username)) ||
      (msg.from !== undefined && array[i] === msg.from.username))
      return true;
  }
  return false;
}
module.exports.isPrivate = function(msg) {

  return msg.chat.type === "private"

}
//
// module.exports.isAllRequirementsDone = function(_row, datas,bounty_value) {
//   var REQUIREMENTS = datas._AD_REQUIREMENTS
//
//   if (_row === undefined || _row === null)
//     return 0;
//
//   var amount =0
//   if(datas._AMOUNT_ALL_TASKS_TOKENS!== undefined)
//     amount = datas._AMOUNT_ALL_TASKS_TOKENS
//   if(bounty_value !== undefined)
//   amount = bounty_value
//
//   for (var i in REQUIREMENTS) {
//     if (
//       ( (REQUIREMENTS[i].required && !REQUIREMENTS[i].redirect_to) || REQUIREMENTS[i].bounty )
//
//       && (_row[REQUIREMENTS[i].type] === undefined ||  _row[REQUIREMENTS[i].type] === null)) {
//
//         console.log(REQUIREMENTS[i].type)
//
//       amount = 0
//     }
//   }
//
//
//   return amount
//
// }

module.exports.getValidReferrals = function(input, valid) {
  // helper.getValidReferrals(_refArray,_validUsers)
  var _valid = []
  for (var i = 0; i < input.length; i++) {

    if (valid.includes(input[i])) {
      _valid.push(input[i])
    }
  }
  // console.log("_validReferrals",valid.length,_valid.length)
  return _valid
}

module.exports.isDisclaimer = function(msg, requirement) {
  return new Promise(function(resolve, reject) {
    console.log("MSG TXT ", msg.text)
    if (requirement === "NO")
      resolve(true)
    else {
      resolve(false)
    }
  })
}