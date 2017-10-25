// 'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sass = require('gulp-sass');
var jslint = require('gulp-jslint');
// var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    // .pipe(autoprefixer())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function () {
    return gulp.src('js/*js')
        .pipe(browserify())
        // .pipe(uglify())
        .pipe(gulp.dest('js/script.js'))
        .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
        .pipe(jslint.reporter( 'my-reporter' ));
});

gulp.task('js-watch', ['js'], function (done) {


    reload;
    done();
});

gulp.task('serve', function(){

	browserSync.init({
		server: {
			baseDir: './',
		},
    port: 8090

	})

	gulp.watch('./scss/**/*.scss', ['sass'])
  gulp.watch('./js/**/*.js', ['js-watch'])
	gulp.watch('index.html').on('change', reload)


});

gulp.task('lint',function(){
  return gulp.src(['source.js'])


gulp.task('default',['sass','serve']);

// gulp.task('sass:watch', function () {
//   gulp.watch('./scss/**/*.scss', ['sass']);
// });
