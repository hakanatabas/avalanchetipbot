var Twitter = require('twitter');
const Discord = require("discord.js");
var twitterFollowers = require('get-twitter-followers')
var moment = require('moment');
var schedule = require('node-schedule');
var _twitter = this
var _db = require('../database/mongo_db.js')
var ava = require('../ava/helper.js')

var params = {
  screen_name: 'nodejs'
};
//take Helis twitter account
var account = TWITTER_CRED_1

var account2 = TWITTER_CRED_2

var rates = {
  search: {
    window: 15 * 60 * 1000,
    requests: 450,
    max: 100

  },
  status: {
    window: 15 * 60 * 1000,
    requests: 900,
    max: 900
  }
}
module.exports.getAllUnDistributedTwitts = function() {
  return _db.find("tip_tweets", {
    status: false
  }, {

  }, false)
}

module.exports.getAllTwitterVerifiedUsers = function() {
  return _db.find("users_participating_1", {
    twitter_verified: true
  }, {}, false)
}
module.exports.payTwitt = function(tweet, userSender, userReceiver) {
  ava.getToWallet(userSender._id).then((f) => {
    ava.getToWallet(userReceiver._id).then((r) => {

      var split = tweet.text.split(' ')
      var amount = 0
      for (var k in split) {

        if (split[k] === HASH_SEARCHABLE) {

          var n = Number(k) + 1
          console.log('split[k]', split[k], HASH_SEARCHABLE, split[(n)], n)
          if (split[n] !== undefined && !isNaN(split[n])) {
            amount = Number(split[n])
          }
        }
      }

      ava.sendAvax(f.login, f.pwd, r.xchain, amount).then((t) => {
        console.log(t.body)
        // console.log('Sender Wallet ', f)
        // console.log('Receiver Wallet ', r)

        var options = {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        };
        tweet.amount = amount;

        if (t.body.error !== undefined) {
          tweet.status_error = t.body.error;
          if (userSender.network === 'telegram') {
            bot.sendMessage(userSender._id, 'We didn\'t tipped ' + tweet.in_reply_to_screen_name + "! Tweet won\'t be tipped. \nCause: " + t.body.error.message +
                "\n" + "<a href='https://twitter.com/" + tweet.in_reply_to_screen_name + "/status/" + tweet.in_reply_to_status_id_str + "'>Your " + HASH_SEARCHABLE + " Tweet</a>", options)
              .then((v) => {
                tweet.status = true;
                _db.set('tip_tweets', tweet._id, null, tweet, false)

              })
          } else if (userSender.network === 'discord') {
            // TODO DISCORD
            client.users.cache.get(userSender._id).send('We didn\'t tipped ' + tweet.in_reply_to_screen_name + "! Tweet won\'t be tipped. \nCause: " + t.body.error.message +
              "\n" + "https://twitter.com/" + tweet.in_reply_to_screen_name + "/status/" + tweet.in_reply_to_status_id_str);
            tweet.status = true;
            _db.set('tip_tweets', tweet._id, null, tweet, false)
          }

        } else
        if (t.body.result !== undefined && t.body.result.txID !== undefined) {
          tweet.status_result = t.body.result;

          if (userSender.network === 'telegram') {
            bot.sendMessage(userSender._id,
                // "Sender Wallet " + f.xchain + "\n" +
                // "Receiver Wallet " + r.xchain + "\n" +
                // "Tx hash " + t.body.result.txID + "\n" +

                "You just tipped " + tweet.in_reply_to_screen_name + " " + amount + " AVAX\n" +
                "<a href='https://explorer.avax.network/tx/" + t.body.result.txID + "'>Your transaction will appear here shortly</a>\n" +
                "<a href='https://twitter.com/" + tweet.in_reply_to_screen_name + "/status/" + tweet.in_reply_to_status_id_str + "'>Your " + HASH_SEARCHABLE + " Tweet</a>", options)
              .then(() => {
                tweet.txID = t.body.result.txID
                tweet.status = true;
                _db.set('tip_tweets', tweet._id, null, tweet, false)
              })
          } else {
            if (userSender.network === 'discord') {
              // TODO DISCORD
              client.users.cache.get(userSender._id).send("You just tipped " + tweet.in_reply_to_screen_name + " " + amount + " AVAX\n" +
                "Check your transaction: https://explorer.avax.network/tx/" + t.body.result.txID + "\n" +
                "Your " + HASH_SEARCHABLE + " Tweet: https://twitter.com/" + tweet.in_reply_to_screen_name + "/status/" + tweet.in_reply_to_status_id_str);
              tweet.status = true;
              _db.set('tip_tweets', tweet._id, null, tweet, false)
            }
          }





          if (userReceiver.network === 'telegram') {
            bot.sendMessage(userReceiver._id,
                // "Sender Wallet " + f.xchain + "\n" +
                // "Receiver Wallet " + r.xchain + "\n" +
                // "Tx hash " + t.body.result.txID + "\n" +

                "You just got tipped on twitter " + amount + " AVAX\n" +
                "<a href='https://explorer.avax.network/tx/" + t.body.result.txID + "'>Your transaction will appear here shortly</a>\n" +
                "<a href='https://twitter.com/" + tweet.in_reply_to_screen_name + "/status/" + tweet.in_reply_to_status_id_str + "'>" + HASH_SEARCHABLE + " Tweet</a>", options)
              .then(() => {
                tweet.txID = t.body.result.txID
                tweet.status = true;
                _db.set('tip_tweets', tweet._id, null, tweet, false)
              })
          } else {
            if (userReceiver.network === 'discord') {
              // TODO DISCORD
              client.users.cache.get(userReceiver._id).send("You just got tipped on Twitter " + amount + " AVAX\n" +
                "Check your transaction: https://explorer.avax.network/tx/" + t.body.result.txID + "\n" +
                "" + HASH_SEARCHABLE + " Tweet: https://twitter.com/" + tweet.in_reply_to_screen_name + "/status/" + tweet.in_reply_to_status_id_str);
              tweet.status = true;
              _db.set('tip_tweets', tweet._id, null, tweet, false)
            }
          }
        }

      })
    })
  })
}

module.exports.payTippedTweets = function() {
  this.getAllUnDistributedTwitts().then((t) => {

    this.getAllTwitterVerifiedUsers().then((u) => {
      for (var i in t) {
        for (var j in u) {

          if (t[i].user_screen_name.toLowerCase() === u[j].twitter.toLowerCase()) {
            // we got payer, let's find payed

            for (var j2 in u) {
              if (t[i].in_reply_to_screen_name.toLowerCase() === u[j2].twitter.toLowerCase()) {
                this.payTwitt(t[i], u[j], u[j2])
              }
            }
          }
        }
      }
    })
  })
}
module.exports.addTweetToDb = function(r, i) {
  return new Promise(async (resolve, reject) => {
    _db.find('tip_tweets', {
      _id: r.statuses[i].id
    }, {}, true).then(count => {

      if (count === 0) {
        _db.set('tip_tweets', r.statuses[i].id, null, {
          id: r.statuses[i].id,
          id_str: r.statuses[i].id_str,
          text: r.statuses[i].text,
          in_reply_to_status_id: r.statuses[i].in_reply_to_status_id,
          in_reply_to_status_id_str: r.statuses[i].in_reply_to_status_id_str,
          in_reply_to_user_id: r.statuses[i].in_reply_to_user_id,
          in_reply_to_user_id_str: r.statuses[i].in_reply_to_user_id_str,
          in_reply_to_screen_name: r.statuses[i].in_reply_to_screen_name,
          user_screen_name: r.statuses[i].user.screen_name.toLowerCase(),
          user: {
            screen_name: r.statuses[i].user.screen_name,
            id: r.statuses[i].user.id,
            id_str: r.statuses[i].user.id_str,
            name: r.statuses[i].user.name
          },
          status: false
        }, false).then(() => {
          this.tweet(account, "Hey @" + r.statuses[i].in_reply_to_screen_name + ", " + r.statuses[i].user.screen_name + " just tipped you!\n" +
            "Claim your rewards on Telegram or Discord. Links on my description!")
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })

  })


}
module.exports.getLatestTippableTweets = function() {
  return new Promise((resolve, reject) => {
    var _promises = []
    this.getTweetsByHashtag(account, HASH_SEARCHABLE, null).then(async (r) => {

      if (r !== null) {
        for (var i in r.statuses) {

          _promises.push(this.addTweetToDb(r, i))
        }

        if (r.search_metadata !== undefined) {
          _promises.push(_db.set('twitter_max_id', 1, null, {
            max: r.search_metadata.max_id
          }, false))
        }
        Promise.all(_promises).then(function(results) {
          resolve()
        })
      } else {
        resolve()
      }
    })
  })
}

// setTimeout(() => {
//   this.verifyTwitterOwnerShip()
// }, 100)
module.exports.verifyTwitterOwnerShip = function() {
  return new Promise((resolve, reject) => {
    _db.find("users_participating_1", {
      $and: [{
        twitter: {
          $exists: true
        },
        twitter_verification: {
          $exists: true
        }
      }, {
        $or: [{
          twitter_verified: false
        }, {
          twitter_verified: {
            $exists: false
          }
        }]
      }]
    }, {
      twitter: 1,
      twitter_verification: 1,
      network: 1
    }, false).then((r) => {
      console.log("end", r)
      if (r.length > 0) {
        this.getLatestTweetsToVerifyOwnerShip(r).then(tw => {
          resolve(true)
        })
      }
    })
  })
}
module.exports.getLatestTweetsToVerifyOwnerShip = function(pendingUsers) {
  return new Promise((resolve, reject) => {
    var _promises = []
    this.getTweetsByHashtag(account, '#Avangerstips', null).then((r) => {
      console.log(r)
      if (r !== null) {

        for (var i in r.statuses) {


          for (var j in pendingUsers) {
            if (pendingUsers[j].twitter.toLowerCase() === r.statuses[i].user.screen_name.toLowerCase() &&
              r.statuses[i].text.includes(pendingUsers[j].twitter_verification)) {
              _congratulateTwitterFounded(pendingUsers[j])
            }
          }

        }
      }

      resolve(r)

    })
  })
}

module.exports.getTweetsByHashtag = function(account, QueryTags, since_id) {
  return new Promise((resolve, reject) => {

    _db.find("twitter_max_id", {}, {

    }, false).then((r) => {
      var client = new Twitter(account);

      var max = 0
      if (r[0] !== undefined)
        max = r[0].max
      client.get('search/tweets', {
        q: QueryTags,
        count: rates.search.max,
        result_type: 'recent',

        since_id: max
      }, function(error, tweets, response) {

        var _count = 1
        if (tweets.search_metadata !== undefined && tweets.search_metadata.max_id === max)
          tweets = null;
        resolve(tweets)
      });
    })
  })
}
module.exports.getAllFollowersFromDb = function() {
  return _db.find("twitter_followers1", {}, {
    screen_name: 1
  }, false)
}

module.exports.checkTwitterToValidate = function() {
  return new Promise((resolve, reject) => {
    _db.find("users_participating_1", {
      $and: [{
        twitter: {
          $exists: true
        }
      }, {
        $or: [{
          twitter_verified: false
        }, {
          twitter_verified: {
            $exists: false
          }
        }]
      }]
    }, {
      twitter: 1,
      network: 1
    }, false).then((r) => {
      // console.log("end", r)
      if (r.length > 0) {
        // let's sync and get new users
        resolve(true)
        // WARNING VERY IMPORTANT
        // this.getAllTwitterFollowers().then((f) => {
        //   // this.getAllFollowersFromDb().then((f) => {
        //
        //   console.log("Total accounts", f.length)
        //   for (var i in r) {
        //     for (var j in f) {
        //       if (r[i].twitter.toLowerCase() === f[j].screen_name.toLowerCase()) {
        //         // user exists
        //
        //         // _congratulateTwitterFounded(r[i])
        //       }
        //     }
        //   }
        //
        // })

        // compare pending users to list of followers
      } else {
        resolve(true)
      }
    })
  })
}
_congratulateTwitterFounded = function(r) {
  _db.set('users_participating_1', r._id, null, {
    twitter_verified: true
  }, false).then((u) => {

    if (r.network === 'telegram') {
      bot.sendMessage(r._id, "Congratulations, your Twitter account has been verified!\nYou can now tip on Twitter by mentionning " + HASH_SEARCHABLE + " in a tweet comment. ")

    } else if (r.network === 'discord') {

      client.users.cache.get(r._id).send("Congratulations, your Twitter account has been verified!\nYou can now tip on Twitter by mentionning " + HASH_SEARCHABLE + " in a tweet comment.");

    }
  })
}
module.exports.getAllTwitterFollowers = function() {
  return new Promise(function(resolve, reject) {
    twitterFollowers(account2, TWITTER_HANDLE_TO_FOLLOW).then(followers => {

      for (var i in followers) {
        _db.set("twitter_followers1", followers[i].id, null, followers[i])
      }
      resolve(followers);
    });
  })
}


module.exports.getNextTweets = function(id) {
  return new Promise(function(resolve, reject) {

    var client = new Twitter(account);


    client.get('statuses/user_timeline', {
      // screen_name: twitterhandler,
      count: rates.status.max,
      // since_id: id,
      include_rts: false,
      exclude_replies: true
    }, function(error, tweets, response) {

      console.log(id, tweets.length); // Tweet body.

      if (tweets.length > 0) {
        var max = tweets[0]
        if (tweets.length === rates.status.max && id !== max.id) {
          _twitter.getNextTweets(max.id).then(function(allRecursivesTweets) {
            var _all = tweets.concat(allRecursivesTweets)

            var _tweets = []
            for (var i in _all)
              _tweets.push({
                created_at: _all[i].created_at,
                id: _all[i].id,
                id_str: _all[i].id_str,
                user: {
                  id: _all[i].user.id,
                  id_str: _all[i].user.id_str,
                  screen_name: _all[i].user.screen_name,
                  followers_count: _all[i].user.followers_count
                }
              })
            resolve(_tweets)
          })
        } else if (max.id === id) {
          // console.log("SAME", tweets.length)
          resolve([])
        } else {

          var _tweets = []
          for (var i in tweets)
            _tweets.push({
              created_at: tweets[i].created_at,
              id: tweets[i].id,
              id_str: tweets[i].id_str,
              user: {
                id: tweets[i].user.id,
                id_str: tweets[i].user.id_str,
                screen_name: tweets[i].user.screen_name,
                followers_count: tweets[i].user.followers_count
              }
            })
          resolve(_tweets)
        }
      } else {
        resolve([])
      }
    })
  });
}

module.exports.getAllTweets = function() {
  return new Promise(function(resolve, reject) {

    var client = new Twitter(account);
    var tweets = []
    _db.find("twitter_tweets", {}, {
      created_at: 1,
      id: 1,
      id_str: 1,
      user: 1
    }, false).then(function(r) {
      console.log("all tweets", r[0])
      var max = {
        id: undefined
      }

      if (r[0] !== undefined && r[0].list !== undefined) {
        tweets = r[0].list
        max = tweets[0]
      }

      _twitter.getNextTweets(max.id).then(function(allRecursivesTweets) {
        // console.log("Object.assign(tweets, allRecursivesTweets), r[0].list)", tweets.length, allRecursivesTweets.length, Object.assign(tweets, allRecursivesTweets, r[0].list).length)
        var _all = tweets.concat(allRecursivesTweets)
        // console.log("all", tweets.length, allRecursivesTweets.length, _all.length)
        if (tweets.length === _all.length) {
          resolve(_all)
        } else {
          _db.set("twitter_tweets", 0, "list", _all).then(function() {
            resolve(_all)
          })
        }
      })
    });
  })
}

module.exports.checkRetweets = function(retweet) {
  return new Promise(function(resolve, reject) {
    var _promises = []
    var client = new Twitter(account);
    client.get('statuses/retweets', {
        id: retweet.id_str,
        count: 100,
      },
      function(error, tweets, response) {
        console.log("CHECK RETWEET", tweets.length)
        resolve(tweets)
      })

  })
}
module.exports.checkAllRetweets = function(tweets) {
  return new Promise(function(resolve, reject) {
    var _promises = []
    var client = new Twitter(account);
    var _allretweets = []
    for (var i in tweets) {
      _promises.push(_twitter.checkRetweets(tweets[i]).then(function(res) {
        _allretweets = _allretweets.concat(res)
      }))
    }

    Promise.all(_promises).then(function(results) {
      console.log("_all", _allretweets.length)
      resolve(_allretweets)
    })
  })
}

module.exports.getAllTweetsAndRetweets = function() {
  return new Promise(function(resolve, reject) {
    _twitter.getAllTweets().then(function(tweets) {

      var _checkRetweetsOneWeek = []

      for (var i in tweets) {

        var _start = moment()
        var _end = moment(tweets[i].created_at);

        // console.log("_start", _start, "_end", _end)
        if (_start.diff(_end, "days") < _maxNumberDaysForRetweet) {
          if (_checkRetweetsOneWeek.length < 75)
            _checkRetweetsOneWeek.push(tweets[i])
        }
      }

      _twitter.checkAllRetweets(_checkRetweetsOneWeek).then(function(results) {

        _db.find("twitter_retweets", {}, {
          created_at: 1,
          id: 1,
          id_str: 1,
          user: 1
        }, false).then(function(r) {
          console.log("FIND R", r)
          var _retweets = []

          if (r[0] !== undefined && r[0].list !== undefined)
            _retweets = r[0].list
          var _length = _retweets.length;

          for (var i in results) {
            var _exists = false;
            for (var j in _retweets) {
              if (_retweets[j].id === results[i].id)
                _exists = true

            }
            if (!_exists)
              _retweets.push(results[i])
          }
          if (_length !== _retweets.length) {
            console.log("LENGTH", _retweets.length)

            var _tweetsFinal = []
            for (var i in _retweets)
              _tweetsFinal.push({
                created_at: _retweets[i].created_at,
                id: _retweets[i].id,
                id_str: _retweets[i].id_str,
                user: {
                  id: _retweets[i].user.id,
                  id_str: _retweets[i].user.id_str,
                  screen_name: _retweets[i].user.screen_name,
                  followers_count: _retweets[i].user.followers_count
                }
              })

            _db.set("twitter_retweets", 0, "list", _tweetsFinal).then(function() {

              resolve(_tweetsFinal)
            })
          } else {
            resolve([])
          }

        })
      })
    })
  })
}


module.exports.tweet = function(account, message) {

  var client = new Twitter(account);

  var _txt = message


  try {

    client.post('statuses/update', {
      status: message
    }, function(error, tweet, response) {
      //
      console.log("TWEETED", tweet); // Tweet body.
      // console.log(response); // Raw response object.
    });
  } catch (err) {
    console.log("ERROR ON TWITTER")
  }

}