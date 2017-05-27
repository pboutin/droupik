'use strict';

const get = require('lodash').get;
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

    _trimBonus(bonus) {
        return lowerFirst(bonus.replace(/ *\. *$/, ''));
    }
}

module.exports = Almanax;
