"use strict";

var _db = require('../database/mongo_db.js')
var moment = require('moment');
var exports_v2 = this
var fs = require('fs');
var admin = require('../admin/admin.js')
var stringify = require('csv-stringify');
var helper = require('../admin/helper.js')
var ava = require('../ava/helper.js')

global._USERS_TOLERANCE_CONTROL = 50

//Bounty promise
var _PromiseBounty = function(_require, _round, _queryValid) {
  return new Promise(function(resolve, reject) {
    _db.find("users_participating_" + _round, _queryValid, {
      "_id": 1
    }, true).then(function(result) {
      resolve({
        type: _require.type,
        unit_value: _require.bounty_token_value,
        total: _require.bounty_token_value * result,
        count: result
      })
    })
  })
}

//Bounty promise
var _ErrorsPromise = function(_require, _round) {


  var _tmp = {}
  _tmp[_require.type] = {
    $exists: false
  }

  return new Promise(function(resolve, reject) {
    _db.find("users_participating_" + _round, _tmp, {
      "_id": 1
    }, true).then(function(result) {
      resolve({
        type: _require.type,


        count: result
      })
    })
  })
}


// module.exports.calcRemainingTokens = function(msg,_round){
//   var _metrics_calc = {
//     date_update: moment().utc(),
//
//     ad_status: true, // ok
//     total_users: 0, //ok
//     total_users_validated: 0, //ok
//     total_token_ditributed: 0, //ok
//     total_token_registration: 0, //ok
//     total_token_referrals: 0, // ok +/- si reflimit; ko
//     total_users_validated_all_tasks: 0, //ok
//     total_token_bonus: 0,
//     total_token_all_tasks: 0,
//     total_users_fathers: 0, //ok
//     total_users_referred: 0, //ok
//     total_users_referred_valid: 0,
//     total_tokens_allocated: 0, //ok
//     total_tokens_remaining: 0, //ok
//     bounties: [],
//     errors: []
//   }
//
//   var _validUsers = []
//   var _validReferred = []
//
//   var ad_round
//   for (var i in _AD_ROUNDS) {
//
//     if (i === _round) {
//       ad_round = _AD_ROUNDS[i]
//     }
//   }
//
//   var _cur = ad_round._AD_REQUIREMENTS
//   var _currentRound = helper.setRowCalc(ad_round)
//   var _REQUIREMENTS = _currentRound._AD_REQUIREMENTS
//
//   var _arrayQuery = []
//   var _arrayAllQuery = []
//   var _arrayQueryReferralsValid = []
//
//   var promises = []
//
//   var _tmp_status = {}
//   _tmp_status["ad_status"] = true
//   var _tmp_invalid = {}
//   _tmp_invalid["invalid"] = {$exists:false}
//
//   _arrayQuery.push(_tmp_status)
//
//
//   _arrayQuery.push(_tmp_invalid)
//   _arrayAllQuery.push(_tmp_invalid)
//
//   _arrayAllQuery.push(_tmp_status)
//   _arrayQueryReferralsValid.push(_tmp_invalid)
//   _arrayQueryReferralsValid.push(_tmp_status)
//
//   //creation of Valid entries and Referral entries query
//   for (var i in _cur) {
//     if (_cur[i].required && !_cur[i].redirect_to && !_cur[i].bounty) {
//       var _tmp = {}
//       _tmp[i] = {
//         $exists: true
//       }
//       _arrayQuery.push(_tmp)
//       _arrayAllQuery.push(_tmp)
//       _arrayQueryReferralsValid.push(_tmp)
//     }
//
//   }
//
//   //Bounties promises
//   for (var i in _cur) {
//     if (_cur[i].bounty && _cur[i].type !== "telegram" && !_cur[i].required) {
//       var _tmp = {}
//       _tmp[i] = {
//         $exists: true
//       }
//       _arrayAllQuery.push(_tmp)
//
//       var _bountyArray = JSON.parse(JSON.stringify(_arrayQuery));
//       _bountyArray.push(_tmp)
//
//       var _queryValid = {
//         $and: _bountyArray
//       }
//
//
//         promises.push(_PromiseBounty(_cur[i], _round, _queryValid).then(function(result) {
//           _metrics_calc.bounties.push(result)
//           _metrics_calc.total_token_bonus += result.total
//
//         }))
//
//
//     }
//   }
//
//
//   //all valid query
//   var _queryValid = {
//     $and: _arrayQuery
//   }
//
//   var _queryAllValid = {
//     $and: _arrayAllQuery
//   }
//
//   var _tmp2 = {
//     father: {
//       $exists: true
//     }
//   }
//
//   _arrayQueryReferralsValid.push(_tmp2)
//   _arrayQueryReferralsValid.push(_tmp_status)
//
//   var _queryReferralsValid = {
//     $and: _arrayQueryReferralsValid
//   }
//
//
//
//   //preparation of the arrays
//   // var _input_All = []
//   // var _input_valid = []
//   //
//   // var _titleArray_all = ["adstatus", "telegramid", "telegramusername", "referrals_list", "referrals_count"]
//   // var _titleArray_valid = ["adstatus", "telegramid", "telegramusername", "is_referred",
//   // // "referrals_list",
//   // //   "referrals_valid",
//   //   "referrals_valid_count",
//   //   _CRYPTO_TICKER + "_SUBSCRIPTION", _CRYPTO_TICKER + "_REFERRALS", _CRYPTO_TICKER + "_BONUS", _CRYPTO_TICKER + "_TOTAL"
//   // ]
//   //
//   // for (var i in _REQUIREMENTS) {
//   //   if ((_REQUIREMENTS[i].required || _REQUIREMENTS[i].bounty) && !_REQUIREMENTS[i].redirect_to) {
//   //     _titleArray_valid.push(_REQUIREMENTS[i].type)
//   //     _titleArray_all.push(_REQUIREMENTS[i].type)
//   //   }
//   // }
//
//   // _input_valid.push(_titleArray_valid)
//   // _input_All.push(_titleArray_all)
//
//
//   var _queryReferralsValidTmp = {
//     "_id": 1,
//     "father": 1,
//     "referrals": 1
//   }
//
//
// // console.log(JSON.stringify(_queryReferralsValid))
//   //
//   // promises.push(_db.find("users_participating_" + _round, _queryReferralsValid, _queryReferralsValidTmp, false).then(function(result) {
//   //   _validReferred = result
//   // }))
//
//
//
//     // promises.push(_db.get('ad', _round).then(function(snapshot) {
//     //   _metrics_calc.ad_status = snapshot.status
//     //
//     // }))
//
// // MODIFIER POUR AVOIR LES REFERRED USER VALID
//     // promises.push(_db.find("users_participating_" + _round, {
//     //   father: {
//     //     $exists: true
//     //   }
//     // }, {}, true).then(function(result) {
//     //   _metrics_calc.total_users_referred = result
//     //
//     // }))
//     //
//     // promises.push(_db.find("users_participating_" + _round, {}, {}, true).then(function(result) {
//     //   _metrics_calc.total_users = result
//     //
//     //
//     // }))
//
//     // console.log("QUERY VALID",JSON.stringify(_queryAllValid))
//     // if (_currentRound._AMOUNT_ALL_TASKS_TOKENS !== undefined) {
//     //   promises.push(_db.find("users_participating_" + _round, _queryAllValid, {
//     //     "_id": 1
//     //   }, true).then(function(result) {
//     //     _metrics_calc.total_users_validated_all_tasks = result
//     //     _metrics_calc.total_token_all_tasks = result * _currentRound._AMOUNT_ALL_TASKS_TOKENS
//     //
//     //   }))
//     // }
//
//     // //Error promises
//     // for (var i in _cur) {
//     //   if (_cur[i].required && !_cur[i].redirect_to && !_cur[i].bounty) {
//     //     promises.push(_ErrorsPromise(_cur[i], _round).then(function(result) {
//     //       _metrics_calc.errors.push(result)
//     //
//     //     }))
//     //   }
//     // }
//
//     //
//     // promises.push(_db.find("users_participating_" + _round, {
//     //   father: {
//     //     $exists: true
//     //   }
//     // }, {
//     //   "_id": 1
//     // }, true).then(function(result) {
//     //   _metrics_calc.total_users_referred = result
//     //
//     // }))
//
// //Modifier pour avoir juste les valid
//     // promises.push(_db.find("users_participating_" + _round, {
//     //   referrals: {
//     //     $exists: true
//     //   }
//     // }, {
//     //   "_id": 1
//     // }, true).then(function(result) {
//     //   _metrics_calc.total_users_fathers = result
//     //
//     //
//     // }))
//
//
//
//
//
//
//   var _queryValidUser = {
//     "_id": 1
//   //  "referrals": 1
//   }
//   var _queryValidReferralsUser = {
//     "_id": 1,
//     "referrals": 1
//   }
//   //
//   // if (mode_exports)
//   //   _queryValidUser = {}
//
//   // console.log("total_users_validated", "start")
//   promises.push(_db.find("users_participating_" + _round, _queryValid, _queryValidUser, false).then(function(result) {
//     _metrics_calc.total_users_validated = result.length
//     _metrics_calc.total_token_registration = result.length * _currentRound._AMOUNT_SUBSCRIBE
//
//     for (var i = 0; i < result.length; i++) {
//       _validUsersArrayId.push(Number(result[i]._id))
//     }
//
//   //  _validUsers = result
//   }))
//
//
//   _arrayQuery.push({referrals:{$exists:true}})
//   var _queryValid = {
//     $and: _arrayQuery
//   }
//
//
//   promises.push(_db.find("users_participating_" + _round, _queryValid, _queryValidReferralsUser, false).then(function(result) {
//     // _metrics_calc.total_users_validated = result.length
//     // _metrics_calc.total_token_registration = result.length * _currentRound._AMOUNT_SUBSCRIBE
//     console.log("RESULTS",result)
//     _validUsers = result
//   }))
//
//
//
//   return new Promise(function(resolve, reject) {
//     Promise.all(promises).then(function(result) {
//
//
//       var _validUsersArrayId = []
//       var _validReferredArrayId = []
//       var _validReferredFatherArrayId = []
//       var _realValidUsers = []
//
//
//       function inAButNotInB(A, B) {
//         return _.filter(A, function (a) {
//           return !_.contains(B, a);
//         });
//       }
//
//       for (var i = 0; i < _validUsers.length; i++) {
//
//
//         var _validReferrals = []
//         if (_validUsers[i] !== undefined
//           && _validUsers[i].referrals !== undefined
//           && _validUsers[i].referrals !== null
//           && _validUsers[i].referrals.length >0){
//
//            _validReferrals = helper.getValidReferrals(_validUsers[i].referrals, _validUsersArrayId)
//           // var _validReferrals2 = inAButNotInB(_validUsers[i].referrals, _validUsersArrayId)
//
//            console.log(_validReferrals,_validReferrals2)
//            // console.log("_validReferrals",_validReferrals.length)
//           if ((_validReferrals !== undefined
//             && _validReferrals !== undefined
//             && _validReferrals.length > 0)
//             && (_validReferrals.length <= _currentRound._REF_LIMIT ||
//                 helper.isWhitelisted(_validUsers[i].id, ad_round) ||
//                  _currentRound._REF_LIMIT === 0 ) ) {
//
//               for(var j=0;j<_validReferrals.length;j++)
//                 _realValidUsers.push(_validReferrals[j])
//
//           } else if(_validReferrals !== undefined && _validReferrals !== undefined && _validReferrals.length > 0){
//             for(var j=0;j<_validReferrals.length && j <_currentRound._REF_LIMIT;j++)
//           _realValidUsers.push(_validReferrals[j])
//
//           }
//
//         }
//
//       }
//
//
//
//       // for (var i = 0; i < _validReferred.length; i++) {
//       //   _validReferredArrayId.push({
//       //     id: Number(_validReferred[i]._id),
//       //     father: Number(_validReferred[i].father),
//       //     referrals : _validReferred[i].referrals
//       //   })
//       //
//       //
//       // }
//       //
//       // for (var i = 0; i < _validReferredArrayId.length; i++) {
//       //
//       //   if (
//       //     _validUsersArrayId.includes(Number(_validReferredArrayId[i].id)) &&
//       //     _validUsersArrayId.includes(Number(_validReferredArrayId[i].father))) {
//       //     _realValidUsers.push(_validReferredArrayId[i])
//       //   }
//       // }
//
//       _metrics_calc.total_users_referred_valid = _realValidUsers.length
//
//       // Works only if there is no referral limited
//       // if there one; we shall calculate per person
//       if (_REF_LIMIT === 0) {
//         _metrics_calc.total_token_referrals = _metrics_calc.total_users_referred_valid * _currentRound._AMOUNT_REF
//       }
//
//       _metrics_calc.total_tokens_allocated = _currentRound._AD_TOTAL_ALLOCATED_TOKENS;
//       _metrics_calc.total_token_ditributed = _metrics_calc.total_token_registration + _metrics_calc.total_token_referrals + _metrics_calc.total_token_bonus + _metrics_calc.total_token_all_tasks
//       _metrics_calc.total_tokens_remaining = _metrics_calc.total_tokens_allocated - _metrics_calc.total_token_ditributed;
//       _TOKEN_REMAINING = _metrics_calc.total_tokens_remaining
//       _metrics_calc.round = _round
//
//
//
//       _metrics_calc.date_end = moment().utc()
//       _metrics_calc.date_diff = moment.duration(_metrics_calc.date_end.diff(_metrics_calc.date_update)).milliseconds();
//       _db.set('metrics', _round, null, _metrics_calc, false)
//
//
//
//       //
//       // var _TOLERANCE = _currentRound._AD_MAX_PERCENT * _currentRound._AD_TOTAL_ALLOCATED_TOKENS
//       //
//
//
//       var _tokens = 0
//
//       for (i in _cur) {
//         if (_cur[i].bounty) {
//           _tokens += _cur[i].bounty_token_value
//         }
//       }
//
//       var _coin = _currentRound._AMOUNT_SUBSCRIBE + _tokens
//
//       var _TOLERANCE_USERS = (_metrics_calc.total_tokens_remaining / _coin) * 0.98
//
//
//
//           if(_TOLERANCE_USERS >= _USERS_TOLERANCE_CONTROL) {
//             _USERS_TOLERANCE_CONTROL=_TOLERANCE_USERS
//           }
//           console.log("_TOKEN_REMAINING",_TOKEN_REMAINING)
//
//
//         //  console.log("_TOLERANCE_USERS",_TOLERANCE_USERS,_metrics_calc.total_tokens_remaining , _coin)
//           //
//           // if(_USERS_TOLERANCE_CONTROL <= 49){
//           //   admin.setAdStatus(false, _round).then(function() {
//           //
//           //       adStatus = false
//           //       _metrics_calc.ad_status = false
//           //         resolve(exports_v2.getMetricsTxt(_metrics_calc))
//           //
//           //   });
//           // }else{
//           //     resolve(exports_v2.getMetricsTxt(_metrics))
//           // }
//
//
//
//
//       //  bot.sendMessage(517752455,exports_v2.getMetricsTxt(_metrics),options)
//
//     })
//   })
//   bot.sendMessage(msg.chat.id,"test")
// }
//
//
//
// var _msg ={
//   chat : {
//     id : 517752455
//   }
// }
// setTimeout(function(){
//
//
// exports_v2.calcRemainingTokens(_msg,"1")
// },2000)

global._TOKEN_REMAINING = 100000
module.exports.checkRemaining = function(_round) {


  var ad_round
  for (var i in _AD_ROUNDS) {

    if (i === _round) {
      ad_round = _AD_ROUNDS[i]
    }
  }

  var _cur = ad_round._AD_REQUIREMENTS
  var _currentRound = helper.setRowCalc(ad_round)
  var _tokens = 0

  for (i in _cur) {
    if (_cur[i].bounty && !_cur[i].required && _cur[i].bounty_token_value > 0) {
      _tokens += _cur[i].bounty_token_value
    }
  }

  var _coin = _currentRound._AMOUNT_SUBSCRIBE + _tokens
  var _coinLimit = _coin * 25

  console.log("REMAINING", _TOKEN_REMAINING, _coinLimit)
  if (_TOKEN_REMAINING < _coinLimit) {



    admin.setAdStatus(false, _round).then(function() {

      adStatus = false
      _metrics.ad_status = false


    });


  }





}

global._metrics = {}
module.exports.init = function(msg, _round, mode_exports) {

  _metrics = {
    date_update: moment().utc(),

    ad_status: true, // ok
    total_users: 0, //ok
    total_users_validated: 0, //ok
    total_token_ditributed: 0, //ok
    total_token_registration: 0, //ok
    total_token_referrals: 0, // ok +/- si reflimit; ko
    total_users_validated_all_tasks: 0, //ok
    total_token_bonus: 0,
    total_token_all_tasks: 0,
    total_users_fathers: 0, //ok
    total_users_referred: 0, //ok
    total_users_referred_valid: 0,
    total_tokens_allocated: 0, //ok
    total_tokens_remaining: 0, //ok
    total_advertising: 0,
    bounties: [],
    errors: [],
    users: {
      telegram: 0,
      discord: 0,
      twitter_verified: 0,
      twitter_not_approved: 0,
      twitter_followers: 0,
    },
    wallets: {
      under_management: 0,
      AVAX: 0,
      aum: 0,
      all: []
    },
    withdraw: {
      amount: 0,
      value: 0
    },
    tips: {
      telegram: 0,
      discord: 0,
      twitter: 0,
      twitter_pending: 0,
      total: 0
    },
    amount_tip: {
      telegram: 0,
      discord: 0,
      twitter: 0,
      twitter_pending: 0,
      total: 0
    }
  }

  var _validUsers = []
  var _validReferred = []

  var ad_round
  for (var i in _AD_ROUNDS) {

    if (i === _round) {
      ad_round = _AD_ROUNDS[i]
    }
  }

  var _cur = ad_round._AD_REQUIREMENTS
  var _currentRound = helper.setRowCalc(ad_round)
  var _REQUIREMENTS = _currentRound._AD_REQUIREMENTS

  var _arrayQuery = []
  var _arrayAllQuery = []
  var _arrayQueryReferralsValid = []
  var _arrayAllQueryAdvertising = []

  var promises = []

  var _tmp_status = {}
  _tmp_status["ad_status"] = true
  var _tmp_invalid = {}
  _tmp_invalid["invalid"] = {
    $exists: false
  }


  // var _tmp_twitter_validated = {}
  // _tmp_twitter_validated["twitter_validated"] = true

  _arrayQuery.push(_tmp_invalid)
  _arrayAllQuery.push(_tmp_invalid)
  _arrayQueryReferralsValid.push(_tmp_invalid)
  _arrayAllQueryAdvertising.push(_tmp_invalid)
  _arrayQuery.push(_tmp_status)
  _arrayAllQuery.push(_tmp_status)
  _arrayQueryReferralsValid.push(_tmp_status)
  _arrayAllQueryAdvertising.push(_tmp_status)

  // _arrayAllQuery.push(_tmp_twitter_validated)
  // _arrayQueryReferralsValid.push(_tmp_twitter_validated)
  // _arrayAllQueryAdvertising.push(_tmp_twitter_validated)

  //creation of Valid entries and Referral entries query
  for (var i in _cur) {
    if (_cur[i].required && !_cur[i].redirect_to && !_cur[i].bounty) {
      var _tmp = {}
      _tmp[i] = {
        $exists: true
      }
      _arrayQuery.push(_tmp)
      _arrayAllQuery.push(_tmp)
      _arrayQueryReferralsValid.push(_tmp)
    }

  }

  //Bounties promises
  for (var i in _cur) {
    if (_cur[i].bounty && _cur[i].type !== "telegram" && !_cur[i].required) {
      var _tmp = {}
      _tmp[i] = {
        $exists: true
      }
      _arrayAllQuery.push(_tmp)

      var _bountyArray = JSON.parse(JSON.stringify(_arrayQuery));
      _bountyArray.push(_tmp)

      var _queryValid = {
        $and: _bountyArray
      }

      if (!mode_exports) {
        promises.push(_PromiseBounty(_cur[i], _round, _queryValid).then(function(result) {
          _metrics.bounties.push(result)
          _metrics.total_token_bonus += result.total

        }))
      }

    }
  }


  //all valid query
  var _queryValid = {
    $and: _arrayQuery
  }

  var _queryAllValid = {
    $and: _arrayAllQuery
  }

  var _tmp2 = {
    father: {
      $exists: true
    }
  }

  _arrayQueryReferralsValid.push(_tmp2)
  _arrayQueryReferralsValid.push(_tmp_status)

  var _queryReferralsValid = {
    $and: _arrayQueryReferralsValid
  }



  //preparation of the arrays
  var _input_All = []
  var _input_valid = []

  var _titleArray_all = ["adstatus", "telegramid", "telegramusername", "referrals_list", "referrals_count"]
  var _titleArray_valid = ["adstatus", "telegramid", "telegramusername", "is_referred",
    // "referrals_list",
    //   "referrals_valid",
    "referrals_valid_count",
    _CRYPTO_TICKER + "_SUBSCRIPTION", _CRYPTO_TICKER + "_REFERRALS", _CRYPTO_TICKER + "_BONUS", _CRYPTO_TICKER + "_TOTAL"
  ]

  for (var i in _REQUIREMENTS) {
    if ((_REQUIREMENTS[i].required || _REQUIREMENTS[i].bounty) && !_REQUIREMENTS[i].redirect_to) {
      _titleArray_valid.push(_REQUIREMENTS[i].type)
      _titleArray_all.push(_REQUIREMENTS[i].type)
    }
  }

  _input_valid.push(_titleArray_valid)
  _input_All.push(_titleArray_all)


  var _queryReferralsValidTmp = {
    "_id": 1,
    "father": 1,
    "referrals": 1
  }

  if (mode_exports)
    _queryReferralsValidTmp = {}

  // console.log(JSON.stringify(_queryReferralsValid))

  _arrayAllQueryAdvertising.push({
    advertising: {
      $exists: true
    }
  })
  var _queryArrayAdvertising = {
    $and: _arrayAllQueryAdvertising
  }

  promises.push(_db.find("users_participating_" + _round, _queryArrayAdvertising, {
    "_id": 1,
    "advertising": 1
  }, false).then(function(result) {
    console.log("RESULT", result)
    for (var i in result)
      _metrics.total_advertising += result[i].advertising
  }))

  promises.push(_db.find("users_participating_" + _round, _queryReferralsValid, _queryReferralsValidTmp, false).then(function(result) {
    _validReferred = result
  }))


  if (!mode_exports) {
    promises.push(_db.get('ad', _round).then(function(snapshot) {
      _metrics.ad_status = snapshot.status

    }))

    // promises.push(_db.find("users_participating_" + _round, {
    //   father: {
    //     $exists: true
    //   }
    // }, {}, true).then(function(result) {
    //   _metrics.total_users_referred = result
    //
    // }))

    promises.push(_db.find("users_participating_" + _round, {}, {}, true).then(function(result) {
      _metrics.total_users = result


    }))
    promises.push(_db.find("users_participating_" + _round, {
      "network": "telegram"
    }, {}, true).then(function(result) {
      _metrics.users.telegram = result


    }))
    promises.push(_db.find("users_participating_" + _round, {
      "network": "discord"
    }, {}, true).then(function(result) {
      _metrics.users.discord = result


    }))
    promises.push(_db.find("users_participating_" + _round, {
      "twitter_verified": true
    }, {}, true).then(function(result) {
      _metrics.users.twitter_verified = result


    }))
    promises.push(_db.find("users_participating_" + _round, {
      $and: [{
          "twitter": {
            $exists: true
          }
        },
        {
          $or: [{
            "twitter_verified": false
          }, {
            "twitter_verified": {
              $exists: false
            }
          }]
        }

      ]
    }, {}, true).then(function(result) {
      _metrics.users.twitter_not_approved = result


    }))


    promises.push(_db.find("twitter_followers" + _round, {

    }, {}, true).then(function(result) {
      _metrics.users.twitter_followers = result


    }))

    promises.push(_db.find("wallets", {

    }, {
      xchain: 1
    }, false).then(function(result) {
      _metrics.wallets.under_management = result.length
      _metrics.wallets.all = result

    }))

    promises.push(_db.find("users_participating_" + _round, {

      AVAX: {
        $exists: true
      }

    }, {}, true).then(function(result) {
      _metrics.wallets.AVAX = result


    }))


    promises.push(_db.find("tip_tweets", {

      $and: [{
        status_result: {
          $exists: true
        },
      }, {
        amount: {
          $exists: true
        }
      }]

    }, {
      amount: 1
    }, false).then(function(result) {
      _metrics.tips.twitter = result.length;
      _metrics.tips.total += result.length
      for (var i in result) {
        _metrics.amount_tip.twitter += Number(result[i].amount)
        _metrics.amount_tip.total += Number(result[i].amount)
      }


    }))
    promises.push(_db.find("tip_tweets", {
      status: false
    }, {
      amount: 1
    }, true).then(function(result) {
      _metrics.tips.twitter_pending = result


    }))



    promises.push(_db.find("tip_tg", {

      $and: [{
        status_result: {
          $exists: true
        },
      }, {
        amount: {
          $exists: true
        }
      }]

    }, {
      amount: 1
    }, false).then(function(result) {
      _metrics.tips.telegram = result.length;
      _metrics.tips.total += result.length
      for (var i in result) {
        _metrics.amount_tip.telegram += Number(result[i].amount)
        _metrics.amount_tip.total += Number(result[i].amount)
      }


    }))







    promises.push(_db.find("tip_withdraw", {

      $and: [{
        status_result: {
          $exists: true
        },
      }, {
        amount: {
          $exists: true
        }
      }]

    }, {
      amount: 1
    }, false).then(function(result) {
      _metrics.withdraw.amount = result.length;

      for (var i in result) {
        _metrics.withdraw.value += Number(result[i].amount)

      }


    }))


    promises.push(_db.find("tip_discord", {

      $and: [{
        status_result: {
          $exists: true
        },
      }, {
        amount: {
          $exists: true
        }
      }]

    }, {
      amount: 1
    }, false).then(function(result) {
      _metrics.tips.discord = result.length;
      _metrics.tips.total += result.length
      for (var i in result) {
        _metrics.amount_tip.discord += Number(result[i].amount)
        _metrics.amount_tip.total += Number(result[i].amount)
      }


    }))

    promises.push(_db.find("users_participating_" + _round, {
      $and: [{
          "twitter": {
            $exists: true
          }
        },
        {
          $or: [{
            "twitter_verified": {
              $exists: false
            }
          }, {
            "twitter_verified": false
          }]
        }

      ]
    }, {}, true).then(function(result) {
      _metrics.users.twitter_verified = result


    }))
    //
    // console.log("QUERY VALID", JSON.stringify(_queryAllValid))
    // if (_currentRound._AMOUNT_ALL_TASKS_TOKENS !== undefined) {
    //   promises.push(_db.find("users_participating_" + _round, _queryAllValid, {
    //     "_id": 1
    //   }, true).then(function(result) {
    //     _metrics.total_users_validated_all_tasks = result
    //     _metrics.total_token_all_tasks = result * _currentRound._AMOUNT_ALL_TASKS_TOKENS
    //
    //   }))
    // }
    //
    // //Error promises
    // for (var i in _cur) {
    //   if (_cur[i].required && !_cur[i].redirect_to && !_cur[i].bounty) {
    //     promises.push(_ErrorsPromise(_cur[i], _round).then(function(result) {
    //       _metrics.errors.push(result)
    //
    //     }))
    //   }
    // }


    // promises.push(_db.find("users_participating_" + _round, {
    //   father: {
    //     $exists: true
    //   }
    // }, {
    //   "_id": 1
    // }, true).then(function(result) {
    //   _metrics.total_users_referred = result
    //
    // }))
    //
    // promises.push(_db.find("users_participating_" + _round, {
    //   referrals: {
    //     $exists: true
    //   }
    // }, {
    //   "_id": 1
    // }, true).then(function(result) {
    //   _metrics.total_users_fathers = result
    //
    //
    // }))

  }




  var _queryValidUser = {
    "_id": 1,
    "referrals": 1
  }

  if (mode_exports)
    _queryValidUser = {}

  // console.log("total_users_validated", "start")
  promises.push(_db.find("users_participating_" + _round, _queryValid, _queryValidUser, false).then(function(result) {
    _metrics.total_users_validated = result.length
    _metrics.total_token_registration = result.length * _currentRound._AMOUNT_SUBSCRIBE

    _validUsers = result
  }))



  //collecting datas of the arrays
  if (mode_exports) {
    promises.push(_db.get("users_participating_" + _round, null).then(function(result) {

      // _allUsers = result
      for (var i in result) {
        var _row = result[i]
        var _length = 0

        if (_row.referrals !== undefined && _row.referrals.length !== undefined)
          _length = _row.referrals.length

        var _valueArray = [
          _row.ad_status,
          _row.id,
          _row.username,
          _row.referrals,
          _length
        ]
        for (var k in _REQUIREMENTS) {

          if ((_REQUIREMENTS[k].required || _REQUIREMENTS[k].bounty) && !_REQUIREMENTS[k].redirect_to)
            _valueArray.push(_row[_REQUIREMENTS[k].type])
        }
        _input_All.push(_valueArray)




      }


      _sendReport(_input_All, msg, "all", _round)
    }))
  }



  return new Promise(function(resolve, reject) {
    Promise.all(promises).then(function(result) {

      var _walletsPromises = []

      for (var i in _metrics.wallets.all) {
        _walletsPromises.push(
          ava.checkWalletBalanceXChain(_metrics.wallets.all[i].xchain).then((r) => {
            if (r.body.result !== undefined && r.body.result.balance !== undefined) {
              _metrics.wallets.aum += Number(r.body.result.balance) / 1000000
            }
          })
        )
      }



      var _validUsersArrayId = []
      var _validReferredArrayId = []
      var _validReferredFatherArrayId = []
      var _realValidUsers = []
      for (var i = 0; i < _validUsers.length; i++) {
        _validUsersArrayId.push(Number(_validUsers[i]._id))
      }
      for (var i = 0; i < _validUsers.length; i++) {


        var _validReferrals = []
        if (_validUsers[i] !== undefined &&
          _validUsers[i].referrals !== undefined &&
          _validUsers[i].referrals !== null &&
          _validUsers[i].referrals.length > 0) {

          _validReferrals = helper.getValidReferrals(_validUsers[i].referrals, _validUsersArrayId)
          // console.log("_validReferrals",_validReferrals.length)
          if ((_validReferrals !== undefined &&
              _validReferrals !== undefined &&
              _validReferrals.length > 0) &&
            (_validReferrals.length <= _currentRound._REF_LIMIT ||
              helper.isWhitelisted(_validUsers[i].id, ad_round) ||
              _currentRound._REF_LIMIT === 0)) {

            for (var j = 0; j < _validReferrals.length; j++)
              _realValidUsers.push(_validReferrals[j])

          } else if (_validReferrals !== undefined && _validReferrals !== undefined && _validReferrals.length > 0) {
            for (var j = 0; j < _validReferrals.length && j < _currentRound._REF_LIMIT; j++)
              _realValidUsers.push(_validReferrals[j])

          }

        }

      }
      // for (var i = 0; i < _validReferred.length; i++) {
      //   _validReferredArrayId.push({
      //     id: Number(_validReferred[i]._id),
      //     father: Number(_validReferred[i].father),
      //     referrals : _validReferred[i].referrals
      //   })
      //
      //
      // }
      //
      // for (var i = 0; i < _validReferredArrayId.length; i++) {
      //
      //   if (
      //     _validUsersArrayId.includes(Number(_validReferredArrayId[i].id)) &&
      //     _validUsersArrayId.includes(Number(_validReferredArrayId[i].father))) {
      //     _realValidUsers.push(_validReferredArrayId[i])
      //   }
      // }

      _metrics.total_users_referred_valid = _realValidUsers.length

      // Works only if there is no referral limited
      // if there one; we shall calculate per person
      if (_REF_LIMIT === 0) {
        _metrics.total_token_referrals = _metrics.total_users_referred_valid * _currentRound._AMOUNT_REF
      }

      _metrics.total_tokens_allocated = _currentRound._AD_TOTAL_ALLOCATED_TOKENS;
      _metrics.total_token_ditributed = _metrics.total_token_registration + _metrics.total_token_referrals +
        _metrics.total_token_bonus + _metrics.total_token_all_tasks +
        _metrics.total_advertising

      _metrics.total_tokens_remaining = _metrics.total_tokens_allocated - _metrics.total_token_ditributed;
      _TOKEN_REMAINING = _metrics.total_tokens_remaining
      _metrics.round = _round



      _metrics.date_end = moment().utc()
      _metrics.date_diff = moment.duration(_metrics.date_end.diff(_metrics.date_update)).milliseconds();



      //
      //
      // var _TOLERANCE = _currentRound._AD_MAX_PERCENT * _currentRound._AD_TOTAL_ALLOCATED_TOKENS
      //


      exports_v2.checkRemaining(_round)

      var _count_referrals = 0
      var _count_total_ref = 0
      if (mode_exports) {
        for (var i = 0; i < _validUsers.length; i++) {

          var data = _validUsers[i]

          var _referralsNumber = 0;

          var _refBonus = helper.getBountyRequirements(_validUsers[i], _REQUIREMENTS)
          var _validReferrals = []
          if (_validUsers[i].referrals !== undefined && _validUsers[i].referrals !== null &&
            _validUsers[i].referrals.length > 0) {

            _validReferrals = helper.getValidReferrals(_validUsers[i].referrals, _validUsersArrayId)
            if (_validReferrals.length <= _currentRound._REF_LIMIT ||
              helper.isWhitelisted(_validUsers[i].id, ad_round) ||
              _currentRound._REF_LIMIT === 0) {

              _referralsNumber += _validReferrals.length

            } else {
              _referralsNumber += _currentRound._REF_LIMIT

            }
            _count_referrals += _referralsNumber
          }






          var amountIsAllDone = helper.isAllRequirementsDone(_validUsers[i], ad_round)
          var _refVal = _referralsNumber * _currentRound._AMOUNT_REF
          //    _metrics.total_token_registration += _refVal

          var total = _currentRound._AMOUNT_SUBSCRIBE + _refVal + _refBonus + amountIsAllDone
          _count_total_ref += _refVal
          var _father = 0
          if (data.father !== undefined)
            _father = 1

          var _valueArray2 = [
            data.ad_status,
            data.id,
            data.username,
            _father,
            // data.referrals,
            // _validUsers[i].referrals,
            _referralsNumber,
            _currentRound._AMOUNT_SUBSCRIBE + amountIsAllDone,
            _refVal,
            _refBonus,
            total
          ]

          for (var j in _REQUIREMENTS) {

            if ((_REQUIREMENTS[j].required || _REQUIREMENTS[j].bounty) && !_REQUIREMENTS[j].redirect_to)
              _valueArray2.push(data[_REQUIREMENTS[j].type])
          }



          _input_valid.push(_valueArray2)





        }
        console.log("_count_referrals", _count_referrals + "\n_count_total_ref:", _count_total_ref)
        _sendReport(_input_valid, msg, "valid", _round)
      }


      _db.set('metrics', _round, null, _metrics, false)
      Promise.all(_walletsPromises).then(function(result) {
        resolve(exports_v2.getMetricsTxt(_metrics))
      })

      //  bot.sendMessage(517752455,exports_v2.getMetricsTxt(_metrics),options)

    })
  })
}


module.exports.getMetricsTxt = function(_row) {

  var _statusText = "LIVE"

  if (_row.ad_status === false)
    _statusText = "CLOSED"

  var _incorrectUsers = _row.total_users - _row.total_users_validated
  var _txt =
    "<b>This is a private admin dashboard\n</b>" +
    "Last update (UTC): " + _row.date_update.format("YYYY-MM-DD HH:mm:ss") + "\n" +
    "Response time : " + _row.date_diff + "ms\n" +


    "\n<b>👥Users </b>\n" +

    "Telegram 👉 <b>" + _row.users.telegram + "</b>\n" +
    "Discord 👉 <b>" + _row.users.discord + "</b>\n" +
    "Total 👉 <b>" + _row.total_users + "</b>\n" +
    "Twitter accounts verified 👉 <b>" + _row.users.twitter_verified + "</b>\n" +
    "Twitter accounts not approved  👉 <b>" + _row.users.twitter_not_approved + "</b>\n" +
    "Twitter followers 👉 <b>" + _row.users.twitter_followers + "</b>\n" +

    "\n<b>💵Wallets </b>\n" +
    "Wallets under management 👉 <b>" + _row.wallets.under_management + "</b>\n" +
    "AVAX withdraw wallets 👉 <b>" + _row.wallets.AVAX + "</b>\n" +
    "Assets under management 👉 <b>" + _row.wallets.aum + " AVAX</b>\n" +


    "\n<b>🤑Withdraw </b>\n" +
    "Past withdrawals 👉 <b>" + _row.withdraw.amount + "</b>\n" +
    "Withdrawals amount 👉 <b>" + _row.withdraw.value + " AVAX</b> \n" +

    "\n<b>💥 Number of unitary tip</b>\n" +
    "Telegram 👉 <b>" + _row.tips.telegram + "</b>\n" +
    "Discord 👉 <b>" + _row.tips.discord + "</b>\n" +
    "Twitter Processed 👉 <b>" + _row.tips.twitter + "</b>\n" +
    "Twitter Pending 👉 <b>" + _row.tips.twitter_pending + "</b>\n" +
    "Total 👉 <b>" + _row.tips.total + "</b>\n" +

    "\n<b>💰 Amount tipped</b>\n" +
    "Telegram 👉 <b>" + _row.amount_tip.telegram + " AVAX</b>\n" +
    "Discord 👉 <b>" + _row.amount_tip.discord + " AVAX</b>\n" +
    "Twitter Processed 👉 <b>" + _row.amount_tip.twitter + " AVAX</b>\n" +
    // "Twitter Pending 👉 <b>" + _row.amount_tip.twitter_pending + "</b>\n" +
    "Total 👉 <b>" + _row.amount_tip.total + " AVAX</b>\n"
  // "Users who submitted information 👉 <b>" + _userParticipated + "</b>\n" +


  return _txt
}


module.exports.getDashBoard = function(msg, _round, mode) {
  exports_v2.init(msg, _round, mode).then(function(result) {

    var _markup = []


    _markup.push([{
        text: '📝 Update Round ' + _round,
        callback_data: 'UPDATE DATABASE_' + _round
      }
      // ,
      // {
      //   text: '📝 Download Round ' + _round,
      //   callback_data: 'DOWNLOAD DATABASE_' + _round
      // }

    ])




    _markup.push(_menu)

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

var _sendReport = function(_input, _msg, name, _round) {



  stringify(_input, function(err, output) {
    if (err) throw err;
    fs.writeFile("jsondb/" + _CRYPTO_TICKER + "_report_" + name + "_round" + _round + ".csv", output, (err) => {
      if (err) throw err;
      var doc = __dirname + "/../jsondb/" + _CRYPTO_TICKER + "_report_" + name + "_round" + _round + ".csv"

      var options = {
        parse_mode: "HTML",
        disable_web_page_preview: true,


      };

      bot.sendDocument(_msg.chat.id, doc, options)

    });
  });
}