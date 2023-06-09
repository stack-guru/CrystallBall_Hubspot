const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */



mix.react('resources/js/react/UserInterface/UI.js', 'public/js')
    .version();

// mix.styles([
//     'resources/css/bootstrap.css',
//     'resources/css/floating-labels.css'
// ], 'public/css/auth.css');

// mix.styles([
//     'resources/css/bootstrap.css',
//     'resources/css/documentation.css'
// ], 'public/css/documentation.css');

// mix.styles([
//     'resources/css/bootstrap.css',
// ], 'public/css/admin.css');
// mix.scripts([
//     'resources/js/bootstrap.js',
// ], 'public/js/admin.js');

// mix.styles([
//     'resources/css/bootstrap.css',
// ], 'public/css/spectator.css');
// mix.scripts([
//     'resources/js/bootstrap.js',
// ], 'public/js/spectator.js');
