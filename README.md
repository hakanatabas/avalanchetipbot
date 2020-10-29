# Project requirements

The Avalanche Tip bot requires:
- a telegram bot account
OR a discord application

Optional:
- a twitter API key

This project can be used to grant AVAX tips on: 
- Telegram without Discord / Twitter  
- Discord without Telegram / Twitter
- Telegram and Discord without Twitter

It can not be used only for twitter without at least Telegram or Discord.

## Install the following Infrastructure

This project requires the following infrastructure requirements
- a Nodejs service. We use pm2 to monitore the state of the nodejs service
```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
nodejs -v
```
- a git account
```bash
sudo apt install git-all
```
- an Avalanche Node, either with public API opened, or running in the same instance as the Avalanche Node
Check Avalanche latest instructions : https://medium.com/avalabs/how-to-install-and-run-ava-borealis-971286add0c0
- an MongoDB database as a mongodb container in your instance
First install docker : https://docs.docker.com/engine/install/ubuntu/  
Then you can launch your mongodb instance with the following instructions : https://hub.docker.com/r/bitnami/mongodb
We highly recommand you to launch a persistant storage with login / password protected

Suggested command (change your user / password )
```bash
sudo su
docker run --name mongodb \
 -v /path/to/mongodb-persistence:/bitnami/mongodb \
 -e MONGODB_USERNAME=my_user -e MONGODB_PASSWORD=password123 \
 -e MONGODB_DATABASE=my_database bitnami/mongodb:latest
 ```

 Verify that your docker database is running
 ```bash
 docker ps
 ```

## Installation
- Clone the project
- Install all dependencies of the nodejs project with
```bash
git clone [url of the project]
npm i
```

## Configuration
Configure global configuration file
```shell
global_config.js
```

- To get your Telegram Bot Id, contact https://t.me/BotFather and type /newbot

- To get your Discord application Id, go to https://discord.com/developers/applications and create an application with

- To get your Twitter credentials, go to https://developer.twitter.com/en/dashboard

## Install PM2 and run you NodeJS Service
```shell
pm2 list : will list all your pm2 process
pm2 start index.js --name avalanchetipbot --max-memory-restart 250M
pm2 save
```

## Invite the tipbot in your Telegram Groups & Discord Groups

For example, shall be an invite link like that for discord
* https://discord.com/api/oauth2/authorize?client_id=755428064531447810&permissions=30720&scope=bot

Define Discord roles & credentials for Embedded content

## License
[BSD-3-Clause License](https://github.com/ava-labs/avalanchejs/blob/master/LICENSE)