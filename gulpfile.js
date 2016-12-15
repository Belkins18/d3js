var gulp            = require('gulp');
var    browserSync     = require('browser-sync');

/* ===========================  Browser-Sync  =========================== */
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            // baseDir: '/var/www/test/priselist/dest/' // Директория для сервера - app
            baseDir: 'dest/'
        },
        notify: false,
        open: true
    });
});


/*============= watch task =============*/
gulp.task('watch', function () {

});
/*============= default task =============*/
// gulp.task('default', ['browser-sync', 'watch']);
gulp.task('default', ['browser-sync']);
