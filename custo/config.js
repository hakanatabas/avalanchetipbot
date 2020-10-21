"use strict";

var dico = require("../custo/dico.js")
var _db = require('../database/mongo_db.js')
var helper = require('../admin/helper.js')


module.exports.init = function() {

  var _lang = "EN"
  var d = dico.getDico()

  global._dico = dico.getDico().EN
  global._MAX_USERS_IN_LOCAL_DB = 1000


  global.hasRequirements = true;
  global._AD_HOME = d[_lang].ad.btn_home

  global._CRYPTO_TOKEN_UNIT_VALUE_DOL = _ICO_TOKEN_UNIT_VALUE_DOL
  global._AD_ROUND_SELECTED = "1"




  global._AD_ROUNDS = {
    "1": {
      status: true,
      _ROUND: "1",
      _ROUND_KEY: "1",
      //  _CRYPTO_SPEC_TEXT: _dico[_lang].rounds["1"].welcome_msg,
      _AD_END_DATE: "08/10/2020",
      _AD_END_HOUR: "22",
      _AMOUNT_SUBSCRIBE_DOLLAR: 2,

      _AMOUNT_ALL_TASKS_TOKENS: 0,
      _AMOUNT_REF_DOLLAR: 0.45,
      _AMOUNT_SUBSCRIBE_TOKENS: 65,
      _AMOUNT_REF_TOKENS: 3,
      _REF_LIMIT: 0,
      _AD_TOTAL_ALLOCATED_TOKENS: 1000000,
      _AD_MAX_PERCENT: 0.995,
      _AD_UNCAPPED: [

      ],
      _AD_REQUIREMENTS: {
        human_smiley: {
          type: "human_smiley",
          type_data: "text",
          required: true,
          bounty: false,
          bounty_token_value: 0,
          // check: helper.humanControl,
          has_image: false,
          is_pow_link: false

        },

        twitter: {
          type: "twitter",
          control_template: "twitter",
          type_data: "text",
          required: true,
          bounty: false,
          bounty_token_value: 0,

          btn_url: _CRYPTO_LINKS.twitter,
          check: helper.isTwitterHandle,
          has_image: false,
          is_pow_link: true,
          redirect_to: false,
          format: helper.cleanTwitterHandle
        },
        AVAXTMP: {
          type: "AVAXTMP",
          type_data: "text",
          required: true,
          bounty: true,
          bounty_token_value: 0,
          redirect_to: false,
          check: helper.avaxWallet,
          has_image: false,
          is_pow_link: false,
          allow_duplicate: true

        },


      }

    }

  }


  global._AD_ROUND = _AD_ROUNDS[_AD_ROUND_SELECTED]._ROUND;

  //global._CRYPTO_SPEC_TEXT = _AD_ROUNDS[_AD_ROUND_SELECTED]._CRYPTO_SPEC_TEXT
  global._AD_END_DATE = _AD_ROUNDS[_AD_ROUND_SELECTED]._AD_END_DATE
  global._AMOUNT_SUBSCRIBE_DOLLAR = Math.round(_AD_ROUNDS[_AD_ROUND_SELECTED]._AMOUNT_SUBSCRIBE_DOLLAR)
  global._AMOUNT_REF_DOLLAR = (_AD_ROUNDS[_AD_ROUND_SELECTED]._AMOUNT_REF_DOLLAR)
  global._AMOUNT_ALL_TASKS_TOKENS = Math.round(_AD_ROUNDS[_AD_ROUND_SELECTED]._AMOUNT_ALL_TASKS_TOKENS)

  global._REF_LIMIT = _AD_ROUNDS[_AD_ROUND_SELECTED]._REF_LIMIT
  global._AD_TOTAL_ALLOCATED_TOKENS = _AD_ROUNDS[_AD_ROUND_SELECTED]._AD_TOTAL_ALLOCATED_TOKENS
  global._AD_TOKEN_MAX_USER = Math.round((_AMOUNT_SUBSCRIBE_DOLLAR + _AMOUNT_REF_DOLLAR) / _CRYPTO_TOKEN_UNIT_VALUE_DOL)

  global._AD_TOTAL_MAX_USERS = (_AD_TOTAL_ALLOCATED_TOKENS / _AD_TOKEN_MAX_USER) * _AD_ROUNDS[_AD_ROUND_SELECTED]._AD_MAX_PERCENT
  global._AD_UNCAPPED = _AD_ROUNDS[_AD_ROUND_SELECTED]._AD_UNCAPPED;
  global._AD_REQUIREMENTS = _AD_ROUNDS[_AD_ROUND_SELECTED]._AD_REQUIREMENTS;

  global._AMOUNT_REF = _AD_ROUNDS[_AD_ROUND_SELECTED]._AMOUNT_REF_TOKENS
  global._AMOUNT_SUBSCRIBE = _AD_ROUNDS[_AD_ROUND_SELECTED]._AMOUNT_SUBSCRIBE_TOKENS


  global._menu = [{
    text: _AD_HOME,
    callback_data: 'GO HOME'
  }]

  global._LANG_LENGTH = _LANGS.length;

  if (Object.size(_LANGS[0]) > _LANG_LENGTH)
    _LANG_LENGTH = Object.size(_LANGS[0])





}