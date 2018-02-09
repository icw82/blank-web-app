'use strict';

const fs = require('fs');
const path = require('path');
const get_basename = path.basename;
const is = require('./is');
const get_flat_structure = require('./get_flat_structure');

const render = (text, content) => {
    for (let item in content) {
        const pattern = RegExp('::' + item + '::', 'gm');
        text = text.replace(pattern, content[item]);
    };

    return text;
}

const create_file = (path, data) => {
    if (typeof data === 'undefined')
        data = '';

    try {
        const descriptor = fs.openSync(path, 'wx+');
        fs.writeSync(descriptor, data);
        fs.closeSync(descriptor);
    } catch (e) {
        console.error('ERROR', e);
    }
}

const create_dir = path => {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        console.error('ERROR', e);
    }
}

module.exports = (target, sample) => new Promise((resolve, reject) => {
    if (!is.dir(target)) {
        const message = dir + ' is not a directory';

        reject(message);
        throw Error(message);
    }

    const targetname = get_basename(target);
    const TargetName = targetname.split('-').map(item =>
        item.charAt(0).toUpperCase() +
        item.substr(1).toLowerCase()
    ).join('');

    // Чтение директории цели
    get_flat_structure(target).then(structure => {
        structure.forEach(node => {
            node.path = node.path.slice(target.length);
        });

        // Перебор образцов
        Promise.all(sample.structure.map(sample_item =>
            new Promise((resolve, reject) => {

                const matched = structure.find(item =>
                    item.path === sample_item.path);

                // Объект существует
                if (matched) {
                    // Это файл?
                    if ('data' in sample_item) {
                        if (matched.data === sample_item.data) {
//                            console.log('Одинаковые')
                        }
                    }
                } else {
                    const new_path = path.resolve(target, sample_item.path);
                    // Это файл?
                    if ('data' in sample_item) {
                        const data = render(String(sample_item.data), {
                            blockname: targetname,
                            appname: targetname,
                            page_ctrl_name: TargetName + 'PageCtrl'
                        });
                        create_file(new_path, data);
                    } else {
                        create_dir(new_path);
                    }
                }
            })
        )).then(resolve, reject);
    }, reject);

});
