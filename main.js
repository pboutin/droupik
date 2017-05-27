'use strict';

const Discord = require('discord.js');
const Dispatcher = require('./app/dispatcher');
const config = require('./config.json');
const moment = require('moment');

moment.locale('fr');

const client = new Discord.Client();

const dispatcher = new Dispatcher(config, client);

client.on('ready', () => {
    console.log('Droupik is listening...');
});

client.on('message', dispatcher.process.bind(dispatcher));

client.login(config['discord_token']);
