/**
 * Created by Administrator on 2017/3/2.
 */
var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('default', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    // gulp.watch("./2016/js/*.js").on('change', browserSync.reload);
    gulp.watch('./*/css/*.css').on('change', browserSync.reload);
    gulp.watch('./*/js/*.js').on('change', browserSync.reload);
    gulp.watch('./*/html/*.html').on('change', browserSync.reload);
    //gulp.watch('./*/less/*.less').on('change', browserSync.reload);
});