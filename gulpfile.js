var gulp = require('gulp');
var jshint = require('gulp-jshint');
var minify = require('gulp-minify');

gulp.task('scripts', function() {
	gulp.src(['src/todolist.js'])
		.pipe(minify({
			ext: {
				min:'.min.js'
			}
		}))
		.pipe(gulp.dest('src'));
});

gulp.task('scripts-lint', function() {
	gulp.src(['src/*.js', '!**/*min.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
	gulp.watch('src/*.js', ['scripts-lint']);
	gulp.watch('src/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'scripts-lint']);
