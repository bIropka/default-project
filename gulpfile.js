var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less');
var path = require('path');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 5 versions'] });
var sourcemaps = require('gulp-sourcemaps');
var csso = require('gulp-csso');
var del = require('del');
var imagein = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var gutil = require('gulp-util');
var ftp = require('gulp-ftp');


var paths = {
    scripts: 'dev/js/*.js',
    images: 'dev/images/*',
    styles: 'dev/styles/general.less',
    markup: 'dev/*.html',
    fonts: 'dev/fonts/*'
};

gulp.task('clean', function() {
    return del('public');
});

gulp.task('markup', function() {
    return gulp.src(paths.markup)
        .pipe(gulp.dest('public'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('public/fonts'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(imagein())
        .pipe(gulp.dest('public/images'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(csso({
            restructure: false
        }))
        .pipe(sourcemaps.write())
        .pipe(rename(function (path) {
            path.basename = "general";
            path.extname = ".css"
        }))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('upload', function () {
    return gulp.src('public/**/*')
        .pipe(ftp({
            host: 'idylli05.ftp.ukraine.com.ua',
            user: 'idylli05_ftp',
            pass: '11gsYTfU41',
            remotePath: '/stetsiura.pro/www/projects/'
        }))
        .pipe(gutil.noop());
});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "public"
        },
        port: 8080,
        open: true,
        notify: false
    });
    gulp.watch('dev/styles/*', ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.markup, ['markup']);
});


gulp.task('default', ['watch', 'markup', 'fonts', 'styles', 'scripts', 'images']);