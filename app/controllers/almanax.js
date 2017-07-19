'use strict';

const get = require('lodash').get;
const map = require('lodash').map;
const deburr = require('lodash').deburr;
const lowerFirst = require('lodash').lowerFirst;

const almanaxData = require('./../../node_modules/dofus-data/almanax-data.json');
const moment = require('moment-timezone');

class Almanax {
    constructor() {
        this.dofusMoment = moment().tz('Europe/Paris');
    }

    getEventForToday() {
        const today = this.dofusMoment.format('YYYY-MM-DD');
        const almanax = get(almanaxData, today, null);

        if (almanax) {
            return `Présentement, ${this._trimBonus(almanax.bonus)}.\nL'offrande du jour : ${almanax.quest}.`;
        }
        throw `Almanax not found for ${today}`;
    }

    getEventForTomorrow() {
        const tomorrow = this.dofusMoment.clone().add(1, 'days').format('YYYY-MM-DD');
        const almanax = get(almanaxData, tomorrow, null);

        if (almanax) {
            return `Demain, ${this._trimBonus(almanax.bonus)}.\nL'offrande sera : ${almanax.quest}.`;
        }
        throw `Almanax not found for ${tomorrow}`;
    }

    getNextDropEvents() {
        return this._formattedFiveFirstMatching(almanaxBonus => {
            return /(butin|challenge|.toile)/.test(almanaxBonus);
        });
    }

    getNextXpEvents() {
        return this._formattedFiveFirstMatching(almanaxBonus => {
            return /(exp.rience|challenge|.toile)/.test(almanaxBonus);
        });
    }

    getNextEventsForKeyword(keyword) {
        return this._formattedFiveFirstMatching(almanaxBonus => {
            return deburr(almanaxBonus.toLowerCase()).indexOf(keyword) !== -1;
        });
    }

    _formattedFiveFirstMatching(testFunction) {
        let currentDate = this.dofusMoment.clone();
        let events = [];

        while (events.length < 5) {
            const currentAlmanax = get(almanaxData, currentDate.format('YYYY-MM-DD'), null);
            if (currentAlmanax === null) {
                break;
            }

            if (testFunction(currentAlmanax.bonus)) {
                events.push({
                    date: currentDate.format('DD/MM/YYYY'),
                    almanaxBonus: currentAlmanax.bonus
                });
            }
            currentDate.add(1, 'days');
        }

        if (events.length === 0) {
            return "Désolé, je n'ai rien trouvé :(";
        }
        const formattedList = map(events, event => {
            return `${event.date} : ${this._trimBonus(event.almanaxBonus)}`
        }).join(';\n');
        return `Voici ce que j'ai trouvé,\n${formattedList}`;
    }

    _trimBonus(bonus) {
        return lowerFirst(bonus.replace(/ *\. *$/, ''));
    }
}

module.exports = Almanax;
