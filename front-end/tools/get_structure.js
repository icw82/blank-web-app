'use strict';

const fs = require('fs');
const join = require('path').join;
const res = require('path').resolve;
const is = require('./is');

const get_structure = path => new Promise((resolve, reject) => {
//    path = res(path);

    if (!is.dir(path)) {
        reject(path + ' is not a directory');
        throw Error(path + ' is not a directory');
    }

    fs.readdir(path, (error, names) => {
        Promise.all(
            names.map(name => new Promise((resolve, reject) => {
                const item = {
                    path: join(path, name)
                };

                if (is.dir(item.path)) {

                    get_structure(item.path).then(results => {
                        if (results.length > 0)
                            item.nodes = results;
                        resolve(item);
                    }, reject);

                } else {
                    fs.readFile(item.path, (err, data) => {
                        if (err) throw err;
                        item.data = data;
                        resolve(item);
                    });

                }

            }))
        ).then(resolve, reject);

    });

});

module.exports = get_structure;
