var gulp = require('gulp');

gulp.task('default', function() {

    var shell = require( "gulp-shell" );

    gulp.task( "js-doc", shell.task( [
        'jsdoc -c conf.json -p'
    ] ) );
});

