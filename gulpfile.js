var mainBowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');
var vinylPaths = require('vinyl-paths');
var gulp = require('gulp');
var print = require('gulp-print');
var addsrc = require('gulp-add-src');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var order = require("gulp-order");
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var fs = require('fs');
var del = require('del');

var config = {
     bowerDir: './vendor/bower_components' ,
    bower: JSON.parse(fs.readFileSync('./bower.json'))
}

gulp.task('default', ['build']);

gulp.task('build', function() {
    runSequence('clean', ['scripts', 'styles']);
});

gulp.task('clean', function() {
    return gulp.src("public/js/*.+(js|map)")
        .pipe(addsrc("public/css/*.+(css|map)"))
        .pipe(print())
        .pipe(vinylPaths(del));
});

gulp.task('scripts', function() {
    return gulp.src(mainBowerFiles({filter: /.\.js$/}))
        .pipe(order(["**/jquery.js", "**/angular.js", "**/*.js"]))
        .pipe(addsrc.append("assets/angular/**/*.js"))
        .pipe(concat(config.bower.name + '.js'))
        .pipe(minify())
        .pipe(gulp.dest('public/js'));
});

gulp.task('styles', function() {
    return gulp.src("resources/assets/sass/**/*.scss")
        .pipe(sass({
            includePaths: [
                config.bowerDir + "/bootstrap-sass/assets/stylesheets",
                config.bowerDir + "/font-awesome/scss"
            ]
        }).on('error', sass.logError))
        .pipe(concat(config.bower.name + '.css'))
        .pipe(cssnano())
        .pipe(gulp.dest("public/css"));
});
