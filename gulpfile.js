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
var uglify = require('gulp-uglify');

var config = {
     bowerDir: './vendor/bower_components' ,
    bower: JSON.parse(fs.readFileSync('./bower.json'))
}

// These are some common paths that we use throughout here.
var paths = {
    'assets': './resources/assets/',
    'bootstrap': './vendor/bower_components/bootstrap-sass/assets/',
    'fontawesome': './vendor/bower_components/font-awesome/'
}

// These options are passed to the JS uglifier. We turn off name mangling
// because it causes issues with AngularJS.
var uglifyOptions = {
    mangle: false
}

gulp.task('default', ['build']);

gulp.task('build', function() {
    runSequence('clean', ['build:angular', 'build:scripts', 'build:styles', 'build:fonts']);
});

gulp.task('build:angular', function() {
    return gulp.src(paths.assets + "angular/**/*.js")
        .pipe(order([
            "dystill.js",
            "*"
        ]))
        .pipe(concat("dystill-web.min.js"))
        .pipe(uglify(uglifyOptions))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('clean', function() {
    return gulp.src("public/js/*.+(js|map)")
        .pipe(addsrc("public/css/*.+(css|map)"))
        .pipe(vinylPaths(del));
});

gulp.task('build:scripts', function() {
    return gulp.src(mainBowerFiles({filter: /.\.js$/}))
        .pipe(order(["**/jquery.js", "**/angular.js", "**/*.js"]))
        .pipe(uglify(uglifyOptions))
        .pipe(gulp.dest('public/js'));
});

gulp.task('build:styles', function() {
    return gulp.src("resources/assets/sass/**/*.scss")
        .pipe(sass({
            includePaths: [
                config.bowerDir + "/bootstrap-sass/assets/stylesheets",
                config.bowerDir + "/font-awesome/scss"
            ]
        }).on('error', sass.logError))
        .pipe(concat(config.bower.name + '.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest("public/css"));
});

gulp.task('build:fonts', function() {
    return gulp.src(mainBowerFiles({filter: /.\.(ttf|eot|otf|svg|woff.*)$/}))
        .pipe(addsrc("resources/assets/fonts/*.+(ttf|eot|otf|svg|woff|woff2)"))
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('watch', ['serve']);

gulp.task('serve', ['build'], function() {
    gulp.watch('resources/assets/sass/*.scss', ['build:styles']);
    gulp.watch('resources/assets/angular/**', ['build:angular']);
    gulp.watch('vendor/bower_components', ['build:scripts', 'build:fonts']);
})
