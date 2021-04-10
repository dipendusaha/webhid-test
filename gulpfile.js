var gulp = require('gulp'),
  connect = require('gulp-connect');
 
gulp.task('webserver', function() {
  connect.server({
	root: './',
	host: '0.0.0.0',
	port: 3000,
	https: true,
	liveload: true});
});
 
gulp.task('default', gulp.series(['webserver']));
