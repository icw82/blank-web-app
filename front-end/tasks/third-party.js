'use strict';

const gulp = require('gulp');
const path = require('path');
const task_name = path.basename(__filename, '.js');
const settings = require('./../settings.js');

const parts = [];

// SCRIPTS
{
    const part = {};
    parts.push(part);

    part.name = 'scripts';
    part.paths = [
        'angular/angular.min.js',
        'angular/angular.min.js.map',
        'angular-i18n/angular-locale_ru.js',
        'angular-cookies/angular-cookies.min.js',
        'angular-cookies/angular-cookies.min.js.map',
        'angular-resource/angular-resource.min.js',
        'angular-resource/angular-resource.min.js.map',
        'angular-route/angular-route.min.js',
        'angular-route/angular-route.min.js.map',
        'kenzo-kit/kk.min.js',
        'kenzo-kit/kk.es5.min.js'
    ].map(item => './node_modules/' + item);
}

// STYLES
{
    const part = {};
    parts.push(part);

    part.name = 'styles';
    part.paths = [
        'kenzo-kit/kk-reset.css'
    ].map(item => './node_modules/' + item);
}


parts.forEach(part => {
    part.task_name = task_name + ':' + part.name;

    gulp.task(part.task_name, () => gulp
        .src(part.paths)//, { allowEmpty: true}
        .pipe(gulp.dest(settings.dest + '/' + part.name + '/third-party'))
    );

    gulp.task('watch:' + part.task_name, () =>
        gulp.watch(part.paths, gulp.task(part.task_name))
    );
});

gulp.task(task_name, gulp.parallel(...parts.map(part => part.task_name)));
