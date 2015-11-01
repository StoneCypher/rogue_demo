
var del            = require('del'),
    fs             = require('fs'),

    gulp           = require('gulp'),
    babel          = require('gulp-babel'),
    browserify     = require('browserify'),
    source         = require('vinyl-source-stream'),

    babel_cfg      = require('./config/babel.json'),
    browserify_cfg = require('./config/browserify.json');





var production = true,

    errorHandler = function(err) {
      console.log(err.toString());
      this.emit("end");
    };





gulp.task('clean', function(cb) {
  return del(['./build'], cb);
});

gulp.task('make-dirs', ['clean'], function(cb) {
  ['./build', './build/js'].map(dir => fs.mkdirSync(dir));
  return cb();
});

gulp.task('babel', ['make-dirs'], function() {
  return gulp.src('./src/*.js')
    .pipe( babel(babel_cfg) )
    .pipe( gulp.dest('./build/js') );
});

gulp.task('browserify', ['babel'], function() {

  return browserify(browserify_cfg, { "debug" : !production })

    .add("./node_modules/mousetrap/mousetrap.js", { "expose" : "mousetrap" })
    .require("./build/js/app.js",                 { "expose" : "app" })

    .bundle()
    .on("error", errorHandler)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest('./build/js'));

});


gulp.task('default', ['browserify']);
