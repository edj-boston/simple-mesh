'use strict';

const del    = require('del'),
    depcheck = require('depcheck'),
    g        = require('gulp-load-plugins')(),
    gulp     = require('gulp'),
    license  = require('./lib/license'),
    rules    = require('@edjboston/eslint-rules');


// Clean the build dir
gulp.task('clean', () => {
    return del([
        'dist/**',
        '!dist'
    ]);
});


// JavaScript
gulp.task('scripts', () => {
    return gulp.src('src/*.js')
        .pipe(g.sourcemaps.init({ loadMaps : true }))
        .pipe(g.concat('simple-mesh.min.js'))
        .pipe(g.tap(file => {
            file.contents = Buffer.concat([ new Buffer(license), file.contents ]);
        }))
        .pipe(g.babel({
            presets  : [ 'es2015' ],
            comments : true,
            compact  : true,
            minified : true
        }))
        .pipe(g.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});


// Lint all JS files (including this one)
gulp.task('lint', () => {
    const globs = [
        'gulpfile.js',
        'src/*.js',
        'lib/*.js',
        'test/*.js',
        '!node_modules/**'
    ];

    return gulp.src(globs)
        .pipe(g.eslint({
            extends       : 'eslint:recommended',
            parserOptions : { 'ecmaVersion' : 6 },
            rules
        }))
        .pipe(g.eslint.format());
});


// Instrument the code
gulp.task('cover', () => {
    const globs = [
        'src/*.js',
        'lib/*.js'
    ];

    return gulp.src(globs)
        .pipe(g.istanbul())
        .pipe(g.istanbul.hookRequire());
});


// Run tests and product coverage
gulp.task('test', () => {
    return gulp.src('test/*.js')
        .pipe(g.mocha({
            require : [ 'should' ]
        }))
        .pipe(g.istanbul.writeReports())
        .pipe(g.istanbul.enforceThresholds({
            thresholds : { global : 52 }
        }));
});


// Check deps with David service
gulp.task('david', () => {
    return gulp.src('package.json')
        .pipe(g.david());
});


// Watch certain files
gulp.task('watch', () => {
    const globs = [
        'src/*.js',
        'test/*.js',
        'lib/*.js'
    ];

    gulp.watch(globs, [ 'build' ])
        .on('change', e => {
            g.util.log('File', e.type, e.path);
        });
});


// Push coverage stats to coveralls
gulp.task('coveralls', () => {
    return gulp.src('coverage/lcov.info')
        .pipe(g.coveralls());
});


// Macro for Travis
gulp.task('travis', done => {
    g.sequence('build', 'coveralls')(done);
});


// Build Macro
gulp.task('build', done => {
    g.sequence(
        'clean',
        'lint',
        'scripts',
        'cover',
        'test'
    )(done);
});


// Examine package.json for unused deps (except for frontend and gulp)
gulp.task('depcheck', g.depcheck({
    ignoreMatches : [
        'babel-preset-es2015',
        'bootstrap',
        'font-awesome',
        'jquery',
        'npm-font-open-sans'
    ],
    specials : [
        depcheck.special['gulp-load-plugins']
    ]
}));


// What to do when you run `$ gulp`
gulp.task('default', done => {
    g.sequence(
        [ 'david', 'depcheck' ],
        'build',
        'watch'
    )(done);
});
