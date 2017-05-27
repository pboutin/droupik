'use strict';

class Admin {
    constructor(client) {
        this.client = client;
    }

    getServers() {
        return this.client.guilds.map(guild => guild.name) || 'None';
    }

    getUptime() {
        return this.client.uptime;
    }
}

module.exports = Admin;