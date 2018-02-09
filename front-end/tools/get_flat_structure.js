'use strict';

const fs = require('fs');
const join = require('path').join;
const is = require('./is');
const get_structure = require('./get_structure');

const flat = nodes => {
    let output = [];

    nodes.forEach(node => {
        output.push(node);

        if ('nodes' in node && (node.nodes instanceof Array)) {
            output = output.concat( flat(node.nodes) );
        }
    });

    return output;
}

const get_flat_structure = path => new Promise((resolve, reject) => {
    get_structure(path).then(nodes => {
        resolve(flat(nodes));
    }, reject);
});

module.exports = get_flat_structure;
