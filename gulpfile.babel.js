var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var ejs = require("gulp-ejs");
var babel = require('gulp-babel');
var amdOptimize = require('amd-optimize');
var concat = require('gulp-concat');


var connection = function(){
  connect.server({
    root: 'docs',
    livereload: true
  });
};

var style = function(cb) {
  gulp.src('./src/assets/sass/index.scss')
  .pipe(sass({style: 'expanded', errLogToConsole: true, includePaths: ['node_modules/']}))
    .on('error', gutil.log)
  .pipe(gulp.dest('./docs/assets/css'))
	.pipe(connect.reload());
  cb();
};

gulp.task('sass',style);

var template = function (cb) {
	gulp.src('./src/index.ejs')
		.pipe(ejs({ }, {}, { ext: '.html' }).on('error', gutil.log))
		.pipe(gulp.dest('./docs'))
		.pipe(connect.reload());
	cb();
}

var scripts = function() {
	return gulp.src(
		[
			'node_modules/babel-polyfill/dist/polyfill.js',
			'./src/assets/js/*.js'
		])
		.pipe(babel({presets: ["@babel/preset-env"]}))
		.pipe(gulp.dest('./docs/assets/js'))
		.pipe(connect.reload());
};

gulp.task('scripts', scripts);

gulp.task('ejs',template);

var watch = function () {
  gulp.watch('./src/assets/sass/*.scss', style);
	gulp.watch('./src/assets/js/*.js', scripts);
	gulp.watch('./src/html/*.ejs', template);
	gulp.watch('./src/html/index.ejs', template);
};

gulp.task('default', gulp.series(
  style,
	scripts,
	template,
  gulp.parallel(connection, watch)
));
