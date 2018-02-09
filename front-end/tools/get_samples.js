'use strict';

const fs = require('fs');
const join = require('path').join;
const is = require('./is');
const get_flat_structure = require('./get_flat_structure');

const get_samples = dir => new Promise((resolve, reject) => {
    if (!is.dir(dir)) {
        const message = dir + ' is not a directory';

        reject(message);
        throw Error(message);
    }

    const samples = [];

    fs.readdir(dir, (error, sample_names) => {
        Promise.all(sample_names.map(sample_name =>
            new Promise((resolve, reject) => {
                const path = join(dir, sample_name, '/');
                get_flat_structure(path).then(structure => {
                    const sample = {
                        name: sample_name,
                        path: path,
                        structure: structure.map(node => {
                            node.path = node.path.slice(path.length);
                            return node;
                        })
                    }

                    resolve(sample);
                }, reject);
            })
        )).then(resolve, reject);
    });
});

module.exports = get_samples;
