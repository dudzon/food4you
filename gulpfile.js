
const { watch, src, dest, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const del = require('del');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const config = {
    app: {
        scss: './src/style/**/*.scss',
        images: './src/images/**/*.*',
        html: './src/*.html'
    },
    dist: {
        base: './dist/',
        images: './dist/images'
    }
}

function cssTask(done) {
    src(config.app.scss)
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(rename({ suffix: '.bundle' }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest(config.dist.base))
    done();
}

function imagesTask(done) {
    src(config.app.images)
        .pipe(dest(config.dist.images))
    done();
}

function templateTask(done) {
    src(config.app.html)
        .pipe(dest(config.dist.base))
    done();
}

function watchFiles() {
    watch(config.app.scss, series(cssTask, reload));
    // watch(config.app.fonts, series(fontTask, reload));
    watch(config.app.images, series(imagesTask, reload));
    watch(config.app.html, series(templateTask, reload));
}

function liveReload(done) {
    browserSync.init({
        server: {
            baseDir: config.dist.base
        },
    });
    done();
}

function reload (done) {
    browserSync.reload();
    done();
}

function cleanUp() {
    return del([config.dist.base]);
}

exports.dev = parallel( cssTask, imagesTask, templateTask, watchFiles, liveReload);
exports.build = series(cleanUp, parallel( cssTask, imagesTask, templateTask));
