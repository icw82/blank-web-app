'use strict';

const gulp = require('gulp');
const path = require('path');
const task_name = path.basename(__filename, '.js');
const settings = require('./../settings.js');

const through = require('through2');

const concat = require('gulp-concat');
const insert = require('gulp-insert');
const babel = require('gulp-babel');
const minify = require('gulp-babel-minify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

const parts = [];
const default_wrapper = [
    '(() => {\n\n',
    '})();'
];

// MAIN
{
    const part = {};
    parts.push(part);

    part.name = 'main';
    part.paths = [
        'base/settings.js',
        'base/scripts.js',
        'base/module.js',
    ].map(item => './sources/' + item);
    part.wrapper = [
        'kk.store = {};\n\n(store => {\n\n',
        '})(kk.store);'
    ];
}

// KK TEMP
{
    const part = {};
    parts.push(part);

    part.name = 'kk.temp';
    part.paths = [
        'base/kk-temp/*.js',
    ].map(item => './sources/' + item);
    part.wrapper = [
        '(kk => {\n\n',
        '})(kk);'
    ];
}

// CLASSES
{
    const part = {};
    parts.push(part);

    part.name = 'classes';
    part.paths = [
        'base/classes/*.js',
    ].map(item => './sources/' + item);
    part.wrapper = ['', ''];
}


parts.forEach(part => {
    part.task_name = task_name + ':' + part.name;

    gulp.task(part.task_name, () => {
        let sequence = gulp
            .src(part.paths)//, { allowEmpty: true}

//        sequence = sequence
//            .pipe(through.obj( (chunk, enc, callback) => {
//                console.log(' . . . . ', chunk.history[0] );
//
//                callback();
//
//            }, cb => cb()));

//            .pipe(replace(
//                /::filename::/g,
//                function(match) {
//                    console.log(match);
//                    return 'bar' + p1;
//                },
//                {skipBinary: true}
//            ));

        if (part.item_wrapper) {
            sequence = sequence
                .pipe(insert.wrap(...part.item_wrapper));
        }

        sequence = sequence
            .pipe(concat(part.name + '.js'))
            .pipe(insert.wrap(...(
                part.wrapper ? part.wrapper : default_wrapper
            )))
            .pipe(gulp.dest(settings.dest + '/scripts'))
            .pipe(minify({
                mangle: {
                    keepClassName: true
                }
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(settings.dest + '/scripts'))

        return sequence
    });

    gulp.task('watch:' + part.task_name, () =>
        gulp.watch(part.paths, gulp.task(part.task_name))
    );
});


gulp.task(task_name, gulp.parallel(...parts.map(part => part.task_name)));
