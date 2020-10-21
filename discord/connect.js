const Discord = require("discord.js");

var events = require('../discord/events.js')

global.client = new Discord.Client();


client.login(BOT_TOKEN_DISCORD);

events.init()