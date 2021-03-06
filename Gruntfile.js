module.exports = function(grunt) {

    // static mapping for plugins that are named differently than the task it requires
    require('jit-grunt')(grunt, {
        sprite: 'grunt-spritesmith'
    });
    require('time-grunt')(grunt);


    grunt.initConfig({
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'web-dev/fonts',
                        src: '**',
                        dest: 'public/fonts'
                    }
                ]
            }
        },
        clean: {
            dist: {
                src: [
                    'public/css/**/*.css',
                    'public/css/**/*.css.map',
                    'public/fonts/**/*.{eot,svg,svgz,ttf,woff}'
                ]
            }
        },
        sass: {
            options: {
                // not needed with ruby sass anymore, will be needed for libsass
                // sourcemap : true
            },
            dev: {
                options: {
                    // expanded for dev
                    style: 'expanded'
                },
                files: {
                    // list your css and corresponding scss pages here
                    'public/css/app.css' : 'web-dev/sass/app.scss'
                }
            },
            dist: {
                options: {
                    // compressed for prod
                    style: 'compressed'
                },
                files: {
                    // list your css and corresponding scss pages here
                    'public/css/app.css' : 'web-dev/sass/app.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                map : true,
                browsers: [
                    // last 2 of all browser
                    'last 2 versions',
                    // ie9+
                    'ie >= 9',
                    // android 2.3+
                    'Android >= 2.3'
                ]

            },
            dev: {
                src: 'public/css/app.css'
            }
        },

        //// imageoptim: {
        ////     options: {
        ////         quitAfter : true
        ////     },
        ////     build: {
        ////         src: [
        ////             'dist/public/**/*.{png,gif,jpg,jpeg}',
        ////             'dist/content/**/*.{png,gif,jpg,jpeg}'
        ////         ]
        ////     }
        //// },
        //
        //// sprite creation, currently only used for the brand tab
        //sprite:{
        //    brands: {
        //        src: 'public/images/brand-tabs/*.png',
        //        dest: 'public/images/brand-tabs/brand-tabs-sprite.png',
        //        destCss: 'public/sass/frontend/elements/_brand-tabs-sprite.scss'
        //    }
        //},

        // watch files
        watch : {
            options: {
                // spawn: false,
                livereload: true
            },
            // make a subtask for each filetype to selectively run tasks and livereload

            //
            // Structure
            //
            // html: {
            //     files: [
            //         '**/*.html'
            //     ]
            // },
            erb: {
                files: [
                    'views/**/*.erb'
                ]
            },
            // rb : {
            //     files: [
            //         '**/*.rb'
            //     ]
            // },

            //
            // Scripts
            //
            js: {
                files: [
                    'assets/javascripts/**/*.js'
                ]
            },

            //
            // Styling
            //
            css: {
                files: [
                    'public/css/*.css'
                ]
            },
            sass: {
                options: {
                    // don't livereload sass because we livereload the css
                    livereload: false
                },
                files: [
                    'web-dev/sass/**/*.scss'
                ],
                // compile on change
                tasks: ['sass:dev', 'autoprefixer']
            }
        },

        // ------------------------------------------------------------------------- //
        // Build-related tasks
        // ------------------------------------------------------------------------- //

        // rev the assets
        rev: {
            options: {
                // defaults
                // encoding: 'utf8',
                // algorithm: 'md5',
                // length: 8
            },
            assets: {
                files: [{
                    src: [
                        // css
                        'public/**/*.css',
                        'public/**/*.css.map',
                        // fonts
                        'public/**/*.{eot,svg,svgz,ttf,woff}',
                        // imgs
                        'public/**/*.{png,jpeg,jpg,gif}'
                    ]
                }]
            }
        },

        // this looks at files to see if a hashed version exists, and rewrites urls
        usemin: {
            html: [
                'app/views/**/*.erb'
            ],
            css: [
                'public/**/*.css'
            ],
            options: {
                root: 'public/',
                // this file globbing is problamatic, but this currently works for all patterns
                assetsDirs: [
                    'public/',
                    '!public/uploads'
                ]
            }
        }

    });


    // ------------------------------------------------------------------------- //
    // Tasks
    // ------------------------------------------------------------------------- //


    // Default task(s).
    grunt.registerTask('default', [
        'sass:dev',
        'autoprefixer',
        'watch'
    ]);

    grunt.registerTask('compile', [
        'sass:dev',
        'autoprefixer'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'sass:dist',
        'autoprefixer',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('heroku', [
        'clean:dist',
        'copy:dist',
        'sass:dist',
        'autoprefixer',
        'rev',
        'usemin'
    ]);
};
