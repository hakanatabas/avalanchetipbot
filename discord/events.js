const Discord = require("discord.js");
const helper = require("../admin/helper.js");
var _db = require('../database/mongo_db.js')
var BOT_TOKEN = "NzU1NDI4MDY0NTMxNDQ3ODEw.X2DJNQ.FWZQGBOpUr88O1D3gqpTCwsouuQ"
var ava = require('../ava/avax.js')
var avax = require('../ava/helper.js')
var dico = require("../custo/dico.js")

const prefix = '!'

module.exports.init = function() {



  client.on("message", function(message) {
    if (message.author.bot) return;



    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (message.channel !== undefined && message.channel.type === 'dm') {
      // VERIFY IF USER EXISTS IN DISCORD TABLE
      helper.createNewUserDiscord(message).then((r) => {


        // IF NOT CREATE USER
        _db.find('users_participating_1', {
          _id: message.author.id
        }, {}, false).then((u) => {

          u = u[0]


          if (commandBody === 'tipinfo') {
            var _txt = _dico.avax.tipinfo.start + "\n" +
              "  `Telegram` \n" +
              "  |--- " + _dico.avax.tipinfo.tg + "\n\n" +
              "  `Discord`\n" +
              "  |--- " + _dico.avax.tipinfo.discord_1 + "\n" +
              "  |--- " + _dico.avax.tipinfo.discord_2 + "\n\n" +
              "  `Twitter`\n" +
              "  |--- " + _dico.avax.tipinfo.twitter

            message.reply(_txt);
          } else if (commandBody === 'deposit') {
            var _txt = _dico.avax.deposit.start + "\n" +
              " 👉 " + u.tip + "\n" +
              "__" + _dico.avax.deposit.end + "__\n"

            message.reply(_txt);
          } else if (command === 'twitter') {
            if (args[0] === undefined) {
              message.reply(_dico.avax.twitter.question + "\n" +
                "__" + _dico.avax.twitter.italic + "__\n" +
                '`!twitter [HANDLE]`');
              // } else if (u.twitter_verified === true) {
              //   message.reply("Your Twitter handle has been already verified. You can't change it!");
            } else if (args[0].indexOf('@') !== 0) {
              message.reply(_dico.avax.twitter.error_a);
            } else {

              function getRandomInt(max) {
                return Math.floor(Math.random() * Math.floor(max));
              }

              _db.find('users_participating_1', {
                twitter: helper.cleanTwitterHandleDiscord(args[0])
              }, {}, true).then((countT) => {

                if (countT === 0) {

                  _db.set('users_participating_1', message.author.id, null, {
                    twitter_verified: false
                  }, false)
                  _db.set('users_participating_1', message.author.id, 'twitter', helper.cleanTwitterHandleDiscord(args[0]), false).then(() => {
                    var _rdm = getRandomInt(200000);
                    _db.set('users_participating_1', message.author.id, null, {
                      // edit: false,
                      twitter_verification: _rdm
                    }, false).then(() => {
                      _txt = _dico.avax.twitter.ownership + "\n" +
                        _dico.avax.twitter.tweet + _rdm + "'\n\n" +
                        _dico.avax.twitter.process
                      message.reply(_txt)
                    })

                  })
                } else {
                  message.reply(_dico.avax.twitter.already_linked);
                }

              })
            }

          } else if (command === 'wallet') {
            if (args[0] === undefined) {
              message.reply(_dico.avax.wallet.start + "\n" +
                "__" + _dico.avax.wallet.privacy + "__\n" +
                "**" + _dico.avax.wallet.security + "**\n" +
                "`!wallet [AVAXWALLET]`");
            } else {
              var msg = {
                text: args[0]
              }
              helper.avaxWallet(msg).then((r) => {
                if (r) {
                  _db.set('users_participating_1', message.author.id, 'AVAX', helper.cleanTwitterHandleDiscord(args[0]), false).then(() => {
                    message.reply(_dico.avax.wallet.saved);
                  })

                } else {
                  message.reply(_dico.avax.wallet.incorrect_format);
                }

              })

            }

          } else if (command === 'withdraw') {
            if (u.AVAX === undefined) {
              message.reply("To withdraw your AvalancheTipBot balance, link your AVAX wallet first!.\nSet it with `!wallet [AVAXWALLET]` first");
            } else if (args[0] === undefined) {
              message.reply("Define your withdraw amount in the command line\n" +
                "`!withdraw [AMOUNT]`");
            } else if (isNaN(args[0])) {
              message.reply("The withdraw amount must be a valid number");
            } else {


              _db.find("wallets", {
                _id: message.author.id
              }, {}, false).then((rWallet) => {


                console.log('Sending', rWallet, u.AVAX, args[0])
                avax.sendAvax(rWallet[0].login, rWallet[0].pwd, u.AVAX, args[0]).then((tc) => {

                  if (tc.body.result !== undefined) {

                    var obg = {}
                    obg.status_result = tc.body.result;
                    obg.txID = tc.body.result.txID;
                    obg.network = 'discord'
                    obg.author = message.author
                    obg.amount = args[0]

                    _db.set('tip_withdraw', message.author.id + '_' + Date.now(), null, obg, false)


                    const exampleEmbed = new Discord.MessageEmbed()
                      // .setColor('#0099ff')
                      // .setTitle('Some title')
                      // .setURL('https://discord.js.org/')
                      // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                      // .setDescription(_txt)
                      .addFields({
                        name: _dico.avax.withdraw.complete + " " + args[0] + ' AVAX',
                        value: "[" + _dico.avax.tx.check + "](https://explorer.avax.network/tx/" + tc.body.result.txID + ")"
                      })

                    message.channel.send(exampleEmbed);
                  } else if (tc.body.error !== undefined) {
                    message.reply(_dico.avax.withdraw.error + '\nCause: ' + tc.body.error.message)
                  }

                })
              })

            }

          } else if (command === 'balance') {
            _db.find("wallets", {
              _id: message.author.id
            }, {}, false).then((rWallet) => {

              if (rWallet[0] !== undefined && rWallet[0].xchain !== undefined) {
                ava.getBalanceDatas(rWallet[0].xchain).then((rWalletBalance) => {
                  console.log("rWalletBalance", rWalletBalance)
                  const exampleEmbed = new Discord.MessageEmbed()

                    .addFields({
                      name: _dico.avax.balance.tip,
                      value: "[" + rWallet[0].xchain + "](https://explorer.avax.network/address/" + rWallet[0].xchain + ")\n"
                    }, {
                      name: "**" + (rWalletBalance.balance / 1000) + "** AVAX",
                      value: "__" + _dico.avax.balance.tip_footer + "__"
                    })

                  message.channel.send(exampleEmbed);

                })
              }

              if (u.AVAX !== undefined) {
                console.log('u.avax', u.AVAX)
                ava.getBalanceDatas(u.AVAX).then((uWallet) => {

                  const exampleEmbed = new Discord.MessageEmbed()

                    .addFields({
                      name: _dico.avax.balance.avax,
                      value: "[" + u.AVAX + "](https://explorer.avax.network/address/" + u.AVAX + ")"
                    }, {
                      name: "**" + (uWallet.balance / 1000) + "** AVAX",
                      value: "__" +
                        _dico.avax.balance.avax_footer + "__"
                    })

                  message.channel.send(exampleEmbed);

                })

              }
            })

          } else if (command === 'info') {

            // message.reply(_txt);

          } else {
            var _txt =
              "Hello,\n\n" +
              _dico.avax.welcome.greetings + "\n\n" +
              _dico.avax.welcome.your_wallet_is + " https://explorer.avax.network/address/" + u.tip + "\n" +
              "__" + _dico.avax.welcome.you_can_deposit + "__\n\n" +

              _dico.avax.welcome.one_click + "\n" +
              "  ▫️ `!start` : " + _dico.avax.welcome.start + "\n" +
              "  ▫️ `!balance` : " + _dico.avax.welcome.balance + "\n" +
              "  ▫️ `!wallet [WALLET]` : " + _dico.avax.welcome.wallet + "\n" +
              "  ▫️ `!twitter [HANDLE]` : " + _dico.avax.welcome.twitter + "\n" +
              "  ▫️ `!deposit` : " + _dico.avax.welcome.deposit + "\n" +
              "  ▫️ `!withdraw [AMOUNT]` : " + _dico.avax.welcome.withdraw + "\n" +
              "  ▫️ `!tipinfo` : " + _dico.avax.welcome.tipinfo + "\n"
            // +
            // "  ▫️ `!info` : Get info on Avalanche\n"

            message.reply(_txt);
          }
        })
      })



    } else if (command === 'tip') {
      // We are now in tiping mode

      if (args.length === 1 && isNaN(args[args.length - 1])) {
        message.reply("Incorrect format\nCorrect format is: `!tip [USERNAME] [AMOUNT IN AVAX]");
      } else if (message.mentions.users.length === 0) {

        message.reply("Incorrect format\nCorrect format is: `!tip [USERNAME] [AMOUNT IN AVAX]");
      } else {

        message.mentions.users = message.mentions.users.array()

        for (var i in message.mentions.users) {
          var msg = {
            author: message.mentions.users[i]
          }
          _sendAvaxFromDiscord(message, msg, args[args.length - 1])

        }
      }

    }

  });


  var _sendAvaxFromDiscord = function(message, msg, amount) {

    helper.createNewUserDiscord(msg).then(() => {
      _db.find('users_participating_1', {
        _id: message.author.id
      }, {}, false).then((u) => {
        _db.find('users_participating_1', {
          _id: msg.author.id
        }, {}, false).then((u2) => {
          _db.find("wallets", {
            _id: message.author.id
          }, {}, false).then((sWallet) => {

            _db.find("wallets", {
              _id: msg.author.id
            }, {}, false).then((rWallet) => {

              if (sWallet !== undefined && sWallet[0] !== undefined) {
                console.log('sWallet', sWallet[0])

                avax.sendAvax(sWallet[0].login, sWallet[0].pwd, rWallet[0].xchain, amount).then((tc) => {
                  if (tc.body.result !== undefined) {
                    var obg = {}
                    obg.status_result = tc.body.result;
                    obg.txID = tc.body.result.txID;
                    obg.network = 'discord'
                    obg.amount = amount
                    obg.author = message.author
                    obg.destination = msg.author

                    _db.set('tip_discord', message.author.id + "_" + msg.author.id + "_" + Date.now(), null, obg, false)
                    const exampleEmbed = new Discord.MessageEmbed()

                      .addFields({
                        name: "Successfully tipped " + amount + ' AVAX to ' + u2[0].username,
                        value: "[Check your transaction](https://explorer.avax.network/tx/" + tc.body.result.txID + ")"
                      })
                    // message.reply("[Check your transaction](https://explorer.avax.network/tx/" + tc.body.result.txID + ")")

                    message.channel.send(exampleEmbed);
                  } else {
                    var obg = {}

                    obg.network = 'discord'
                    obg.author = message.author
                    obg.destination = msg.author
                    obg.status_error = tc.body.error;
                    _db.set('tip_discord', message.author.id + "_" + msg.author.id + "_" + Date.now(), null, obg, false)
                    message.channel.send('Tip is not possible\nCause: ' + tc.body.error.message);

                  }
                })

              }
            })

          })
        })
      })
    })
  }

}