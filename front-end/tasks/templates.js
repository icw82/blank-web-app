'use strict';

const gulp = require('gulp');
const path = require('path');
const task_name = path.basename(__filename, '.js');
const settings = require('./../settings.js');

const map = require('map-stream');
const rename = require('gulp-rename');
//const sqlite3 = require('sqlite3');

const parts = [];

// BASE
{
    const part = {};
    parts.push(part);

    part.name = 'base';
    part.paths = [
        'base/template.html'
    ].map(item => './sources/' + item);
}

// PAGES
{
    const part = {};
    parts.push(part);

    part.name = 'pages';
    part.paths = [
        'pages/*/template.html'
    ].map(item => './sources/' + item);
}

// BLOCKS
{
    const part = {};
    parts.push(part);

    part.name = 'blocks';
    part.paths = [
        'blocks/*/template.html'
    ].map(item => './sources/' + item);
}

// COMPONENTS
{
    const part = {};
    parts.push(part);

    part.name = 'components';
    part.paths = [
        'components/*/template.html'
    ].map(item => './sources/' + item);
}

parts.forEach(part => {
    part.task_name = task_name + ':' + part.name;

    gulp.task(part.task_name, () => gulp
        .src(part.paths)//, { allowEmpty: true}
        .pipe(map((file, callback) => {
//            console.log('>>', String(file.contents));
            callback(null, file);
        }))
        .pipe(rename(path => {
            if (part.name === 'base') {
                path.basename = 'base';
            } else {
                path.basename = path.dirname;
                path.dirname = '.';
            }
        }))
        .pipe(gulp.dest(settings.dest + '/templates/' +
            ((part.name === 'base') ? '' : part.name)
        ))
    );

    gulp.task('watch:' + part.task_name, () =>
        gulp.watch(part.paths, gulp.task(part.task_name))
    );
});

gulp.task(task_name, gulp.parallel(...parts.map(part => part.task_name)));
