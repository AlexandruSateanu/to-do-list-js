var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var sassLint = require('gulp-sass-lint');

var scssFiles =  'style/scss/**/*.scss';
var cssDest = 'style/css/';

gulp.task('scripts', function() {
	gulp.src(['scripts/script.js'])
		.pipe(minify({
			ext: {
				min:'.min.js'
			}
		}))
		.pipe(gulp.dest('scripts'));
});

gulp.task('scripts-lint', function() {
	gulp.src(['scripts/*.js', '**/*-min.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
	gulp.src(scssFiles)
		.pipe(sassLint({
			options: {
				formatter: 'stylish',
				'merge-default-rules': true
			},
			rules: {
				'indentation': ['1', {'size': '4'}],
				'property-sort-order': ['1', {'order': 'smacss'}],
				'no-ids': '0',
				'no-url-domains': '0',
				'no-url-protocols': '0'
			},
			files: {ignore: 'style/scss/utils/_reset.scss'}	
		}))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(cssDest));
});

gulp.task('styles', function() {
	gulp.src(['style/css/main.css'])
		.pipe(gulp.dest(cssDest))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(cssDest));
});

gulp.task('watch', function () {
	gulp.watch('scripts/*.js', ['scripts-lint']);
	gulp.watch('scripts/*.js', ['scripts']);
	gulp.watch(scssFiles, ['sass']);
	gulp.watch(cssDest, ['styles']);
});

gulp.task('default', ['scripts', 'scripts-lint', 'sass', 'styles']);
