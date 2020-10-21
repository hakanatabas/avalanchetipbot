# Project requirements

The Avalanche Tip bot requires :
- a telegram bot account
- a discord application
- a twitter API key


## Install the following Infrastructure

This project requires the following infrastructure requirements
- a Nodejs service. We use pm2 to monitore the state of the nodejs service
- an Avalanche Node, either with public API opened, or running in the same instance as the Avalanche Node
- an MongoDB database


## Installation

Install all dependencies of the nodejs project with
```bash
npm i
```

## Configuration
Configure global configuration file
```shell
global_config.js
```

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
[MIT](https://choosealicense.com/licenses/mit/)
