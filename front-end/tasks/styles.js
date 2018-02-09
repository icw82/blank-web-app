'use strict';

const gulp = require('gulp');
const path = require('path');
const task_name = path.basename(__filename, '.js');
const settings = require('./../settings.js');

const concat = require('gulp-concat');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const mixins = require('postcss-mixins');
const custom_properties = require('postcss-custom-properties');
const color_functions = require('postcss-color-function');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');

const parts = [];

// commons
{
    const part = {};
    parts.push(part);

    part.name = 'kk.ui';
    part.paths = [
        'base/kk-temp/*.css',
    ].map(item => './sources/' + item);
}

// MAIN
{
    const part = {};
    parts.push(part);

    part.name = 'main';
    part.paths = [
        'base/styles.css',
        'blocks/*/styles.css',
        'components/*/styles.css',
    ].map(item => './sources/' + item);
}

parts.forEach(part => {
    part.task_name = task_name + ':' + part.name;

    gulp.task(part.task_name, () => gulp
        .src(part.paths)//, { allowEmpty: true}
        .pipe(concat(part.name + '.css'))
        .pipe(postcss([
            mixins(),
            custom_properties(),
            color_functions(),
        ]))
//        .pipe(rename({suffix: '.min'}))
//        .pipe(csso().on('error', gutil.log))
        .pipe(gulp.dest(settings.dest + '/styles'))
    );

    gulp.task('watch:' + part.task_name, () =>
        gulp.watch(part.paths, gulp.task(part.task_name))
    );
});

gulp.task(task_name, gulp.parallel(...parts.map(part => part.task_name)));
