const { task, series, src, dest, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const cssnano = require('cssnano')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const csscomb = require('gulp-csscomb')
const autoprefixer = require('autoprefixer')

const PATHS = {
  scssRoot: './assets/scss/**/*.scss',
  cssRoot: './assets/css/',
  scssFolder: './assets/scss',
  htmlFiles: './*.html',
  jsFiles: './assets/js/**/*.js'
}
const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ['last 2 versions', '> 1%', 'ie >= 11']
  })
]

const pluginsForMincss = PLUGINS.concat([cssnano()])

function scss() {
  return src(PATHS.scssRoot)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(PLUGINS))
    .pipe(dest(PATHS.cssRoot))
    .pipe(browserSync.stream())
}

function scssDev() {
  const pluginsDevMode = []
  return src(PATHS.scssRoot, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(pluginsDevMode))
    .pipe(dest(PATHS.cssRoot, { sourcemaps: true }))
    .pipe(browserSync.stream())
}

function scssMin() {
  return src(PATHS.scssRoot)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(pluginsForMincss))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PATHS.cssRoot))
    .pipe(browserSync.stream())
}

function scssComb() {
  return src(PATHS.scssRoot).pipe(csscomb()).pipe(dest(PATHS.scssFolder))
}

function browserSyncInit() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
}

async function reload() {
  await browserSync.reload()
}

function watchFiles() {
  browserSyncInit()
  watch(PATHS.scssRoot, scss)
  watch(PATHS.htmlFiles, reload)
  watch(PATHS.jsFiles, reload)
}

function watchFilesDev() {
  browserSyncInit()
  watch(PATHS.scssRoot, scssDev)
  watch(PATHS.htmlFiles, reload)
  watch(PATHS.jsFiles, reload)
}

task('scss', series(scss, scssMin))
task('dev', scssDev)
task('watch', watchFiles)
task('watchDev', watchFilesDev)
task('comb', scssComb)
