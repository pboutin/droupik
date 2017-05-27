'use strict';

const filter = require('lodash').filter;

const AdminController = require('./controllers/admin');
const AlmanaxController = require('./controllers/almanax');

class Dispatcher {
    constructor(config, client) {
        this.config = config;
        this.almanaxController = new AlmanaxController();
        this.adminController = new AdminController(client);

        this.dispatchRules = [
            { text: '!servers', action: this.adminController.getServers.bind(this.adminController) },
            { text: '!uptime', action: this.adminController.getUptime.bind(this.adminController) },
            { rule: /almanax.*demain/i, action: this.almanaxController.getEventForTomorrow.bind(this.almanaxController) },
            { rule: /almanax/i, action: this.almanaxController.getEventForToday.bind(this.almanaxController) }
        ];
    }

    process(message) {
        if (! this._isConcernedBy(message)) { return; }

        console.log("Processing : ", message.content);

        const authorIsAdmin = message.author.tag === this.config['admin_tag'];

        let matchedRules = filter(this.dispatchRules, dispatchRule => {
            if (dispatchRule.text) {
                if (! authorIsAdmin && dispatchRule.text[0] === '!') {
                    return false;
                }
                return dispatchRule.text === message.content;
            }
            if (dispatchRule.rule) {
                return dispatchRule.rule.test(message.content);
            }
            return false;
        });

        if (matchedRules.length) {
            message.reply(matchedRules[0].action());
        } else {
            message.reply("Je n'ai pas très bien compris, désolé.");
        }
    }

    _isConcernedBy(message) {
        if (message.author.tag === this.config['self_tag']) {
            return false;
        }
        return message.channel.constructor.name === 'DMChannel' || (/droupik/i).test(message.content);
    }
}

module.exports = Dispatcher;