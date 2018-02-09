'use strict';

const gulp = require('gulp');
const path = require('path');
const join = path.join;
const get_basename = path.basename;
const task_name = get_basename(__filename, '.js');
const settings = require('./../settings');
const is = require('./../tools/is');
const get_samples = require('./../tools/get_samples');
const repair_directory = require('./../tools/repair_directory');

const fs = require('fs');

const samples = get_samples('./samples/');

const make_part = params => new Promise((resolve, reject) => {
    // Чтение каталога
    fs.readdir(params.path, (error, content) => {
        // Перебор каталога
        Promise.all(content.map(block => {
            const path_to_item = join(params.path, block, '/');

            if (!is.dir(path_to_item))
                return;

            // Получение шаблонов
            samples.then(samples => {
                repair_directory(path_to_item, samples.find(
                    item => item.name === params.sample)
                );
            }, reject);
        })).then(resolve, reject);
    });
});

const parts = [{
    path: './sources/pages',
    sample: 'page'
}, {
    path: './sources/components',
    sample: 'component'
//}, {
//    path: './../back-end/apps',
//    sample: 'django_apps'
}];

gulp.task(task_name,
    () => Promise.all(
        parts.map(item => make_part(item))
    )
);
