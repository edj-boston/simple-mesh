'use strict';

const fs    = require('fs'),
    license = require('../lib/license'),
    moment  = require('moment');

describe('license', () => {
    it('should dynamically produce the year', () => {
        const year = moment().format('YYYY');
        const { version } = JSON.parse(fs.readFileSync('package.json'));
        license.should.startWith('/*!');
        license.should.containEql(year, version);
        license.should.endWith('*/');
    });
});
