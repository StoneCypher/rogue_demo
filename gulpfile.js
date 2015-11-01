
var gulp = require('gulp'),
    del  = require('del'),
    fs   = require('fs');

gulp.task('clean', function(cb) {
  return del(['./build'], cb);
});

gulp.task('make-dirs', ['clean'], function(cb) {
  fs.mkdirSync('./build');
  return cb();
});

gulp.task('default', ['make-dirs'], function() {
  console.log('hello, i am gulp');
});
