'use strict';

//const fs = require('fs');

const settings = {};
const info = require('./package.json');

settings.name = 'KENZO APP';
settings.codename = info.name;
settings.version = info.version;

settings.dest = '../back-end/static/';

module.exports = settings;
