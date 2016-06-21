// Gulp 4

'use strict';

var chalk = require('chalk');
var gulp  = require('gulp');
var jade  = require('gulp-jade');
var less  = require('gulp-less');
var path  = require('path');

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

//
// Variables
//
var paths = {
  dirs: {
    build: 'builds/'
  }
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// - Multi Project metods - //

//
// Options
//
// Глобальные настройки контекста для всех задач
//
// Используется для определения контекста по умолчанию
// и хранения текущнго контекста при прослушке
var dirProjects     = 'apps/',
    prefixProject   = '', /*'app-'*/
    options         = {
                        project: prefixProject + getDefaultContext('canonium')
                    };

// Функция получения контекста по умолчанию
//
// Определяет контекст, исходя из переданных аргументов при запуске. Если
// первый аргумент undefined, то берется второй и, если он имеет `--` в
// начале, то он считается проектом. Это сделано для поддержки запуска задач,
// например, `gulp jade --yellfy`
function getDefaultContext(defaultName) {
    var argv = process.argv[2] || process.argv[3];
    if (typeof argv !== 'undefined' && argv.indexOf('--') < 0) {
        argv = process.argv[3];
    }
    return (typeof argv === 'undefined') ? defaultName : argv.replace('--', '');
};

// Функция перехода в контекст
//
// На основе пути изменившегося файла определяет каталог проекта,
// выводит имя проекта, к которому относится изменение и путь до него
function runInContext(filepath, cb) {
    var context = path.relative(process.cwd(), filepath);
    var projectName = context.split(path.sep)[1];

    // Console
    console.log(
        '[' + chalk.green(projectName.replace(prefixProject, '')) + ']' +
        ' has been changed: ' + chalk.cyan(context)
    );

    // Set project
    options.project = projectName;

    cb();
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


//
// Jade
//
gulp.task('jade', function () {
    return gulp.src(path.join(dirProjects + options.project, 'templates/*.jade'))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(paths.dirs.build + options.project))
});


//
// Less
//
gulp.task('less', function () {
    return gulp.src(path.join(dirProjects + options.project, 'less/*.less'))
        .pipe(less())
        .pipe(gulp.dest(paths.dirs.build + options.project))
});


//
// Watch
//
gulp.watch(dirProjects + prefixProject + '*/templates/*.jade').on('change', function (filepath) {
    runInContext(filepath, gulp.series('jade'));
});

gulp.watch(dirProjects + prefixProject + '*/less/*.less').on('change', function (filepath) {
    runInContext(filepath, gulp.series('less'));
});

gulp.task('default', gulp.parallel('jade', 'less'));
