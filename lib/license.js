'use strict';

const fs = require('fs'),
    moment = require('moment');

// Create data
const year = moment().format('YYYY');
const { version } = JSON.parse(fs.readFileSync('package.json'));

// Template the license string
const license = `/*!
* SimpleMesh
* Copyright (c) ${year} Eric Johnson
* Version ${version}
* Licensed under the MIT license
* http://ericjohnson.me
*/`;

// Export the license string
module.exports = license;
