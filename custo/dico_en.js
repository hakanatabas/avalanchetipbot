"use strict";

//var dico = require("../custo/dico.js")

module.exports.get = function() {
  var _dico = {}

  _dico.avax = {
    "welcome": {
      "greetings": "I am AvalancheTipBot!",
      "your_wallet_is": "🚀 Your AvalancheTipBot wallet is",
      "you_can_deposit": "You can deposit AVAX and start tipping your friends and community members!",
      "one_click": "You are one click away from :",
      "start": "Starting again 😉",
      "balance": "Check your tips and wallet balance",
      "wallet": "Add your Avalanche AVAX wallet",
      "twitter": "Link your Twitter account",
      "deposit": "View deposit instructions",
      "withdraw": "View withdrawal instructions",
      "tipinfo": "Learn how to tip someone on Telegram, Discord, and Twitter",
      "info": "Get info on Avalanche"
    },
    "tipinfo": {
      "start": "You can tip AVAX on Telegram, Discord, and Twitter:",
      "tg": "Reply to a user with the command `/tip [AMOUNT]` to tip that user in a channel with @AvalancheTipBot",
      "discord_1": "Use the command `!tip @USERNAME [AMOUNT]` in a Discord server with @AvalancheTipBot",
      "discord_2": "- You can add multiple usernames `!tip USERNAME USERNAME2 [AMOUNT]`",
      "twitter": "Reply to a user’s tweet with `" + HASH_SEARCHABLE + " [AMOUNT]` to tip that user"
    },
    "deposit": {
      "start": "You can deposit AVAX to your AvalancheTipBot wallet",
      "end": "Deposited funds are withdrawable at any time"

    },
    "twitter": {
      "question": "1. Follow Avalanche on Twitter https://twitter.com/avalancheavax\n\n" +
        "2. Type your Twitter handle with “@” (e.g., @avalancheavax)\n\n" +
        "3. Verify your ownership with a tweet\n\n" +
        "4. You can send tips to users by replying their tweet with “" + HASH_SEARCHABLE + " [amount]” (e.g., " + HASH_SEARCHABLE + " 10 to tip 10 AVAX)\n\n",
      "italic": "I verify Twitter accounts every 15 minutes",
      "error_a": "Your Twitter handle must start with @.",
      "ownership": "Now you need to verify the ownership of your Twitter account.",

      "tweet": "Tweet this: 'I am an #Avanger on Twitter #Avangerstips #avax",
      "process": "This process might take few minutes (confirmation of ownership)",
      "already_linked": "You have already linked the Twitter account to AvalancheTipBot. This action is not permitted."


    },
    "wallet": {
      "start": "1. Enter your Avalanche X-Chain public address\n\n" +
        "2. Congrats! You have successfully connected your AVAX wallet address for withdrawal ;)",
      "privacy": "🚨WE WILL NEVER ASK FOR YOUR PRIVATE KEYS🚨",
      "security": "This wallet is only used to withdraw your tip balance to your AVAX wallet.\n",
      "saved": "✅ Your Avalanche X-Chain wallet is linked!",
      "incorrect_format": "This is not a correct AVAX wallet format.",
      "link_confirm": "You are about to link this Avalanche X-Chain wallet",
      "link_confirmed": "Click on the button bellow to confirm"
    },
    "withdraw": {
      "error": "Withdraw is not possible",
      "error_2": "Incorrect tip format -> '10' to withdraw 10 AVAX\n" +
        "Type again how many AVA-X you want to withdraw",
      "complete": "You just withdraw",
      "type": "Type the amount you want to withdraw"

    },
    "tx": {
      "check": "Your transaction will appear here shortly"
    },
    "balance": {
      "tip": "AvalancheTipBot wallet balance 👉",
      "tip_footer": "You can deposit AVAX and start tipping your friends and community members, or make a withdrawal!",
      "avax": "AVAX mainnet wallet balance 👉",
      "avax_footer": "You can change that wallet anytime. This wallet is used only as a destination for your withdraws"
    },
    "tip": {
      "error": "Incorrect tip format -> /tip 10 to tip 10 AVAX"
    }





  }
  _dico.others = {
    "hello": "Hello",
    "greetings": "I am AvalancheTipBot!\n",
    "read_rules": "",
    "msg_earn": "",
  }

  _dico.ico = {

    "end_ad_msg": "Program are now finished.",

    "msg_info_short": "Avalanche is an open-source platform for launching decentralized finance applications and enterprise blockchain deployments in one interoperable, highly scalable ecosystem.",



    "infos": {
      docs: ["website", "doc", "support", "wallet", "explorer", "grant", "community", "newsletter"],
      social: ["discord", "telegram", "telegram_ann", "twitter", "linkedin", "facebook", "reddit", "github", "youtube"]
    },

    "msg_docs": "✅ Ressources",
    "msg_social": "✅ Social",
    "msg_partners": "✅ Partners",
    "msg_reviews": "✅ Reviews",

    "msg_website": "▶️ Website:",
    "msg_onepager": "▶️ Onepager:",
    "msg_doc": "▶️ Documentation:",
    "msg_whitepaper": "▶️ Whitepaper:",
    "msg_wallet": "▶️ Avalanche Wallet:",
    "msg_support": "▶️ Support:",
    "msg_explorer": "▶️ Avalanche Explorer:",
    "msg_grant": "▶️ Avalanche-X:",
    "msg_community": "▶️ Community:",
    "msg_publicsale": "▶️ Public sale:",
    "msg_lightpaper": "▶️ Lightpaper:",
    'msg_presentation': "▶️ Presentation:",

    'msg_telegram': "▶️ Telegram:",
    'msg_telegram_ann': "▶️ Telegram Annoucement:",
    'msg_medium': "▶️ Medium:",
    'msg_facebook': "▶️ Facebook :",
    'msg_facebook_2': "▶️ Facebook :",
    'msg_facebook_3': "▶️ Facebook :",

    'msg_twitter': "▶️ Twitter :",
    'msg_twitter_2': "▶️ Twitter :",
    'msg_twitter_3': "▶️ Twitter :",

    'msg_reddit': "▶️ Reddit:",
    'msg_instagram': "▶️ Instagram:",
    'msg_linkedin': "▶️ LinkedIn:",
    'msg_github': "▶️ GitHub:",
    'msg_discord': "▶️ Discord:",
    'msg_vk': "▶️ VK:",
    'msg_bitcointalk': "▶️ Bitcointalk:",
    'msg_youtube': "▶️ Youtube:",
    'msg_newsletter': "▶️ Sign up for Newsletter:"

  }

  _dico.ad = {
    "btn_home": "🌐 Home",
    "btn_balance": "💰 Balance",
    "btn_twitter": "🦆 Twitter",
    "btn_deposit": "📥 Deposit",
    "btn_info": "ℹ️ Information",
    "btn_rules": "🚨 Rules",
    "btn_lang": "🏁 Language",
    "btn_edit_info": "🗣 Submit my application",
    "btn_cancel": "❌ Cancel",
    "btn_withdraw": "🤑 Withdraw",
    "CLAIM": "Claim",
    "YES": "Yes",

    "btn_contribute": "",
    "msg_delivery": "",
    "msg_referral_1": "",
    "msg_referral_2": "",
    "msg_referral_3": "",
    "thank_you_disqualified": "",
    "thank_you": "Your twitter account is added and will be verified in the next 3hours",
    "thank_you_all": "🎉Congratulations, you've completed all the tasks for the ad !",
    "chances_start": "You have",
    "chances_end_single": "chance left!",
    "chances_end_plurial": "chances left!",
    "duplicate_entry": "This data has already been submitted. This is not eligible.",
    "welcoming": {
      "greetings": "I am your friendly " + _CRYPTO_NAME + " bot.",
      "read_rules": "<b>Please read the rules before starting</b>",

    },
    // "presale": "You can also take part of our presale with our bot @MinglechainPreSaleBot and refer your friends to get 5% of there investment.\nWith a discount of 50% from the IEO Price ! 🚀🚀"
  }
  _dico.submission = {
    "msg_welcome": "",
    "msg_edit": "",
    "msg_datas": "",
    "msg_datas_empty": "",
    "msg_helper": "",
    "msg_saved": "",
    "msg_data_incorrect": "",
    "msg_get_your_bonus": "",
    "msg_get_more_tasks": ""
  }
  _dico.balance = {
    "msg_uncapped": "",
    "msg_balance_is": "",
    "msg_tokens": "",
    "msg_round": "",
    "msg_refer": "",
    "msg_refer_overview": "",
    "msg_friend": "",
    "msg_friends": "",
    "msg_header_title": "",
    "msg_title_registration": "",
    "msg_title_bounties": "",
    "msg_title_referrals": "",
    "msg_body_referrals": "",
    "msg_calc_final": ""
  }
  _dico.rules = {
    "title": "",
    "requested": {
      "title": "",
      "msg_social_medias": "",
      "msg_stay": ""
    },
    "prohibited": {
      "title": "",
      "msg_text": ""
    },
    "close": {
      "title": "",
      "msg_text_date": "",
      "msg_text": ""
    },
    "referrals": {
      "title": "💰 Referrals",
      "msg_referrals_every": "",
      "msg_referrals_max": "",
      "msg_referrals_valid": ""
    },

    "rights": {
      "msg_text": ""
    }
  }




  _dico.rounds = {
    "1": {
      "welcome_msg_1": "",
      "welcome_msg_2": "",
      "actions": {

        "twitter": {
          text_valid: "Twitter profile link",
          text_valid_long: "Your Twitter profile handler ",
          text_question: _dico.avax.twitter.question,
          text_rule: "- You must follow us on Twitter",
          btn_txt: "Register your Twitter 🐥",
          check_invalid: "This is not a valid Twitter handle. A valid Twitter handle starts with “@” (e.g., @avalancheavax)",
          check_valid: ""
        },



        "AVAXTMP": {
          text_valid: "AVAX address",
          text_valid_long: "Your Avalanche X-Chain wallet address is",
          // text_question: "- Type your ERC20 wallet address",
          text_question: _dico.avax.wallet.start + "\n" +
            "\n" +
            "<b>" + _dico.avax.wallet.privacy + "</b>\n" +
            "<i>" + _dico.avax.wallet.security + "</i>",
          btn_txt: "Save your AVAX address",
          check_invalid: "This is not a correct Avalanche X-Chain address.\nYour record has not been saved",
          check_valid: ""
        },



        "human_smiley": {
          text_valid: "Human Control",
          text_valid_long: "You passed the human control! Welcome!",
          text_question: "<b>Are you really human ?</b>\n" +
            "Prove it by clicking the correct button:",
          text_rule: "- You must pass the human control test",

          btn_txt: "Are you human?",
          check_invalid: "You did not pass human control.\nTry again !",
          check_valid: "Passed!"
        }

      }
    },

  }

  return _dico;
}