var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var babel = require('gulp-babel');
var es2015 = require('babel-preset-es2015');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');

var css = __dirname + '/css/';
var js = __dirname + '/js/';

var src = '';
var dev = '';
var prod = '';

var cssSrcFile = 'app.less';
var cssDevFile = 'app.css';
var cssProdFile = 'app.min.css';
var cssSrc = css + src;
var cssDev = css + dev;
var cssProd = css + prod;

var jsSrcFile = 'src/app.js';
var jsDevFile = 'app.js';
var jsProdFile = 'app.min.js';
var jsSrc = js + src;
var jsDev = js + dev;
var jsProd = js + prod;

var onError = function (err) {
    gutil.log(gutil.colors.red("ERROR", "less"), err);
    this.emit("end", new gutil.PluginError("less", err, { showStack: true }));
};

// http://www.browsersync.io/docs/options/#option-proxy
// ie. yousite.com
var proxyUrl= 'localhost:8007';

gulp.task('browser-sync', function() {
    browserSync({
        proxy: proxyUrl,
        ws: true,
        // port: 5000
    });
});

gulp.task('build-css', function() {
    return gulp.src([cssSrc + cssSrcFile])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(less().on('error', onError))
    .pipe(rename(cssDevFile))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cssDev))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('build-css-prod', function() {
    return gulp.src([cssSrc + cssSrcFile])
    .pipe(less().on('error', onError))
    .pipe(minifyCss())
    .pipe(rename(cssProdFile))
    .pipe(gulp.dest(cssProd));
});

gulp.task('watch-css', function() {
    return gulp.watch(cssSrc + '*.less', ['build-css']);
});

gulp.task('build-js', function() {
    return gulp.src([jsSrc + jsSrcFile])
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: [es2015]
    }))
    .on('error', onError)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsDev))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('build-js-prod', function() {
    return gulp.src([jsSrc + jsSrcFile])
    .pipe(babel({
        presets: [es2015]
    }))
    .on('error', onError)
    .pipe(uglify())
    .pipe(rename(jsProdFile))
    .pipe(gulp.dest(jsProd));
});

gulp.task('watch-js', function() {
    return gulp.watch(jsSrc + '**/*.js', ['build-js']);
});

gulp.task('default', ['browser-sync', 'build-css', 'watch-css', 'build-js', 'watch-js']);
gulp.task('prod', ['build-css-prod', 'build-js-prod']);
