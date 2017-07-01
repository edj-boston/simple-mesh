'use strict';

const del      = require('del'),
    depcheck   = require('depcheck'),
    g          = require('gulp-load-plugins')(),
    gulp       = require('gulp'),
    license    = require('./lib/license'),
    rules      = require('@edjboston/eslint-rules');


// Clean the build dir
gulp.task('clean', () => {
    return del([
        'dist/**',
        '!dist'
    ]);
});


// JavaScript
gulp.task('scripts', () => {
    return gulp.src('src/js/*.js')
        .pipe(g.sourcemaps.init({ loadMaps : true }))
        .pipe(g.babel({
            presets  : [ 'es2015' ],
            comments : true,
            compact  : false
        }))
        .pipe(g.concat('simple-mesh.min.js'))
        .pipe(g.tap(file => {
            file.contents = Buffer.concat([ new Buffer(license), file.contents ]);
        }))
        .pipe(g.uglify({ output : { comments : /^!/ } }))
        .pipe(g.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});


// Lint all JS files (including this one)
gulp.task('lint', () => {
    const globs = [
        'gulpfile.js',
        'src/*.js',
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


// Run tests and product coverage
gulp.task('test', () => {
    return gulp.src('test/*.js')
        .pipe(g.mocha({
            require : [ 'should' ]
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
        'src/*',
        'test/*'
    ];

    gulp.watch(globs, [ 'build' ])
        .on('change', e => {
            g.util.log('File', e.type, e.path);
        });
});


// Build Macro
gulp.task('build', done => {
    g.sequence(
        'clean',
        'scripts',
        'test',
        'lint'
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
        'david',
        // 'depcheck',
        'build',
        'watch'
    )(done);
});
