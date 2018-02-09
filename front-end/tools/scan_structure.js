'use strict';

const fs = require('fs');
const join = require('path').join;
const is = require('./is');

module.exports = location => new Promise((resolve, reject) => {
    fs.readdir(location, (error, content) => {
        const submodules = [];
        const structure = content
            .map(name => {
                return {
                    'name': name,
                    'path': join(location, name),
                    'submodules': []
                }
            })
            .filter(item => is.dir(item.path));

        structure.forEach(item => {
            submodules.push(new Promise((resolve, reject) => {
                fs.readdir(item.path, (error, content) => {
                    const submodules = content
                        .map(name => {return {
                            'name': name.replace(/(\d+-)/, ''),
                            'path': join(item.path, name)
                        }})
                        .filter(item => is.dir(item.path));

                    item.submodules = submodules;
                    resolve(submodules);
                });
            }));
        });

        Promise.all(submodules).then(() => {
            resolve(structure);
        });
    });
});
