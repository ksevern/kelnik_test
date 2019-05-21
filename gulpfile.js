const { src, dest, watch, series, parallel } = require('gulp');
const pug = require('gulp-pug'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  notify = require('gulp-notify'),
  babel = require('gulp-babel'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  imgmin = require('gulp-imagemin'),
  mozjpeg = require('imagemin-mozjpeg'),
  pngquant = require('imagemin-pngquant'),
  del = require('del');

// Clean dist
function clean() {
  return del('dist/*');
}

// Pug to html
function html() {
  return src('src/pug/*.pug')
    .pipe(plumber({
      errorHandler: notify.onError('👽 <%= error.message %>')
    }))
    .pipe(pug({ pretty: true }))
    .pipe(dest('dist/'))
    .pipe(reload({ stream: true }))
}

// Sass to css
function css() {
  return src('src/scss/style.scss')
    .pipe(plumber({
      errorHandler: notify.onError('👻 <%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 6 versions']
    }))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('dist/static/css/'))
    .pipe(reload({ stream: true })) 
}

// Js
function js() {
  return src('src/js/*.js')
    .pipe(plumber({
      errorHandler: notify.onError('🐱 <%= error.message %>')
    }))
    .pipe(concat('index.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename('index.min.js'))
    .pipe(dest('dist/static/js'))
    .pipe(reload({ stream: true }))
}

// Images
function images() {
  return src('src/img/**/*.*')
    .pipe(dest('dist/static/img'))
    .pipe(reload({ stream: true }))
}

// Json
function json() {
  return src('src/json/**/*.*')
    .pipe(dest('dist/static/json'))
    .pipe(reload({ stream: true }))
}

// Min images for build
function imagesBuild() {
  return src('src/img/**/*.*')
    .pipe(imgmin([
      pngquant(),
      mozjpeg()
    ], {
      verbose: true
    }))
    .pipe(dest('dist/static/img'))
    .pipe(reload({ stream: true }))
}

// Assets
function assetsCss() {
  return src('src/assets/**/*.css')
    .pipe(concat('assets.css'))
    .pipe(dest('dist/static/assets'))
    .pipe(reload({ stream: true }))
}

function assetsJs() {
  return src('src/assets/**/*.js')
    .pipe(concat('assets.js'))
    .pipe(uglify())
    .pipe(dest('dist/static/assets'))
    .pipe(reload({ stream: true }))
}

// Watch
function watching() {
  watch('src/pug/**/*.pug', html)
  watch('src/scss/**/*.scss', css);
  watch('src/js/*.js', js);
  watch('src/img/**/*.*', images);
}

// Connect
function browser() {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000,
    notify: false
  })
}

exports.build = series(
  clean,
  parallel(
    html,
    css,
    js,
    json,
    imagesBuild,
    parallel(assetsCss,assetsJs)
  )
);
exports.watch = watching;
exports.clean = clean;
exports.default = series(
  clean,
  parallel(
    html,
    css,
    js,
    json,
    images,
    parallel(assetsCss,assetsJs)
  ),
  parallel(browser, watching)
);
exports.browser = browser;
