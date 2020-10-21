var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
var moment = require('moment');
var async = require('async');
var fs = require('fs');

var _db = require('../database/mongo_db.js')

var twit = require('./twitter.js')

var ruleTwit = new schedule.RecurrenceRule();
// ruleTwit.hour = [];
// ruleTwit.minute = [0, 15, 30, 45];
// ruleTwit.minute = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
ruleTwit.second = [0];


// TWITTER CRON , EVERY 15 HOURS
var _everyday = schedule.scheduleJob(ruleTwit, function() {
  twit.verifyTwitterOwnerShip().then((f) => {})
})

// GET ALL TWEETS THAT ARE TIPPABLE
var tipMachine = new schedule.RecurrenceRule();
// tipMachine.hour = [2, 7, 11, 16, 21, 23];
tipMachine.minute = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
tipMachine.second = [0];
var _everyday = schedule.scheduleJob(tipMachine, function() {

  twit.getLatestTippableTweets().then((f) => {
    twit.payTippedTweets()
  })
})
twit.verifyTwitterOwnerShip().then((f) => {})
// twit.checkTwitterToValidate().then((f) => {})
// twit.getLatestTippableTweets().then((f) => {
//   twit.payTippedTweets()
// })
// setTimeout(() => {
//
//
//   twit.checkTwitterToValidate().then((f) => {})
// }, 1000)