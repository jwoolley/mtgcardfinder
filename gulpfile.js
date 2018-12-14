'use strict';

const gulp = require('gulp');
const colors = require('ansi-colors');
const log = require('fancy-log');
const debug = require('gulp-debug');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence');

const SRC_FILES = {
  JS: ['./*.js', 'src/**/*.js'],
};

gulp.task('jslint', function() {
  const completionTracker = function(results) {
    results = results || [];

    const result = results.reduce(function(all, current) {
      all.errors += current.errorCount;
      all.warnings += current.warningCount;
      return all;
    }, { errors: 0, warnings: 0 });

    if (result.errors > 0) {
      log(colors.red('>>> Javascript linting: ' + colors.underline('FAILED') + '.'));
    } else if (result.warnings > 0) {
      log(colors.yellow('>>> Javascript linting ' + colors.underline('COMPLETED with warnings') + '.'));
    } else {
      log(colors.green('>>> Javascript linting ' + colors.underline('COMPLETED') + '.'));
    }
  };

  return gulp.src(SRC_FILES.JS)
    .pipe(debug({title: 'Linting'}))
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format('codeframe')) 
    .pipe(eslint.format())
    .pipe(eslint.format(completionTracker));
});

gulp.task('lint', function(callback) {
  runSequence('jslint', callback);
});

gulp.task('watch', function() {
  gulp.watch([SRC_FILES.JS], ['lint']);
});

gulp.task('default', ['lint', 'watch']);