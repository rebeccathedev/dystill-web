require('dotenv').config();

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');

    const notifier = require('node-notifier');
    const empty = require('is-empty');

    const paths = {
        'assets': './src/resources/assets/',
        'bootstrap': './node_modules/bootstrap-sass/assets/',
        'fontawesome': './node_modules/@fortawesome/fontawesome-free/',
        'jquery': './node_modules/jquery/dist/',
    }

    // These are some include paths that we might use in some of the files. This
    // allows us to, for instance, say @include "font-awesome" and have it
    // resolved into the file here when we build it.
    const includePaths = [
        paths.bootstrap + 'stylesheets/',
        paths.fontawesome + 'scss/'
    ];

    grunt.loadNpmTasks('grunt-shell');

    grunt.initConfig({
        shell: {
            init: {
                command: [
                    "cd src"
                ].join(" && ")
            },
            clean: {
                command: "find ./build ! -name '.gitignore' -mindepth 1 -maxdepth 1 -exec rm -rf {} +"
            },
            buildDocker: {
                command: [
                    "find ./src/storage/logs ! -name '.gitignore' -type f -exec rm -f {} +",
                    "docker-compose build"
                ].join(" && ")
            },
            buildComposer: {
                command: "cd ./build && composer install --no-dev"
            },
            deployDocker: {
                command: [
                    'docker tag ' + process.env.DOCKER_REPO + ' ' + process.env.DOCKER_REGISTRY + '/' + process.env.DOCKER_REPO,
                    'docker push ' + process.env.DOCKER_REGISTRY + '/' + process.env.DOCKER_REPO,
                ].join(" && ")
            },
            up: {
                command: 'docker-compose -f docker-compose.yml -f docker-compose.development.yml up'
            },
            stop: {
                command: 'docker-compose -f docker-compose.yml -f docker-compose.development.yml stop'
            },
            down: {
                command: 'docker-compose -f docker-compose.yml -f docker-compose.development.yml down'
            }
        },

        sass: {
            options: {
                implementation: require('node-sass'),
                sourceMap: true,
                sourceComments: false,
                outputStyle: "compressed",
                includePaths: includePaths,
                precision: 5,
                linefeed: "lf"
            },
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: './',
                    src: [paths.assets + 'sass/**.scss'],
                    dest: './build/public/css',
                    ext: '.min.css'
                }]
            }
        },
        copy: {
            appEnv: {
                files: [
                    {
                        cwd: './',
                        src: 'src/.env',
                        dest: './build/.env'
                    }
                ]
            },
            laravel: {
                files: [
                    {
                        cwd: './src/app',
                        src: '**/*',
                        dest: './build/app',
                        expand: true
                    },
                    {
                        cwd: './src/bootstrap',
                        src: ['*.php', 'cache'],
                        dest: './build/bootstrap',
                        expand: true
                    },
                    {
                        cwd: './src/config',
                        src: '**/*',
                        dest: './build/config',
                        expand: true
                    },
                    {
                        cwd: './src/routes',
                        src: '**/*',
                        dest: './build/routes',
                        expand: true
                    },
                    {
                        cwd: './src/database',
                        src: '**/*',
                        dest: './build/database',
                        expand: true
                    },
                    {
                        cwd: './src/public',
                        src: ['css', 'fonts', 'img', 'js', 'templates', 'index.php', '.htaccess', 'robots.txt'],
                        dest: './build/public',
                        expand: true
                    },
                    {
                        cwd: './src/resources',
                        src: ['lang/**/*', 'views/**/*'],
                        dest: './build/resources',
                        expand: true
                    },
                    {
                        cwd: "./src/storage",
                        src: ['app', 'custom_handlers', 'files', 'framework/cache', 'framework/sessions', 'framework/views', 'graphics', 'logs'],
                        dest: './build/storage',
                        expand: true
                    },
                    {
                        cwd: './src',
                        src: ['artisan', 'server.php'],
                        dest: './build',
                        expand: true
                    }
                ]
            },
            composer: {
                files: [
                    {
                        cwd: './src',
                        src: ['composer.json', 'composer.lock'],
                        dest: './build',
                        expand: true
                    }
                ]
            },
            npmFiles: {
                files: [
                    // JS
                    {src: paths.bootstrap + 'javascripts/bootstrap.min.js', dest: './build/public/js/bootstrap.min.js'},
                    {src: paths.jquery + 'jquery.min.js', dest: './build/public/js/jquery.min.js'},

                    // Fonts
                    {src: paths.fontawesome + 'webfonts/*', dest: './build/public/fonts/', flatten: true, expand: true},
                ]
            },
            favicons: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: paths.assets + 'favicons/*',
                        dest: 'public'
                    }
                ]
            }
        }
    });

    function runAndNotify(task, message) {
        grunt.task.run(task);
        notifier.notify({
            'title': 'Build Complete',
            'message': message
        });
    }

    grunt.registerTask('watch:sass', function() {
        runAndNotify('build:sass', "SCSS built.");
    });

    grunt.registerTask('watch:laravel', function() {
        runAndNotify('build:laravel', "Laravel sources built.");
    });

    grunt.registerTask('build:sass', ['sass']);
    grunt.registerTask('build:docker', ['shell:buildDocker']);
    grunt.registerTask('build:laravel', ['copy:laravel']);
    grunt.registerTask('build:build', [
        'clean',
        'shell:init',
        'copy:laravel',
        'copy:npmFiles',
        'copy:composer',
        'shell:buildComposer',
        'build:sass',
    ]);

    grunt.registerTask('build', [
        'build:build',
        'build:docker'
    ]);

    // So grunt-contrib-watch squats on the 'watch' task name. But we want to
    // use that. So we define our own watch task. This task immediately renames
    // itself, then loads the actual contrib task to run. I can't believe this
    // actually works.
    grunt.registerTask('watch', function() {
        grunt.renameTask('watch', 'foo');
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.config.set('watch', {
            laravel: {
                files: "src/**/*.php",
                tasks: 'watch:laravel'
            },
            sass: {
                files: [paths.assets + "sass/**/*.scss"],
                tasks: 'watch:sass'
            }
        });

        grunt.task.run('build:build');
        grunt.task.run('copy:appEnv');
        grunt.task.run('watch');
    });

    grunt.registerTask('init', function() {
        grunt.task.run('shell:init');
    });

    grunt.registerTask('clean', ['shell:clean']);
    grunt.registerTask('deploy', ['shell:deployDocker']);
    grunt.registerTask('up', ['shell:up']);
    grunt.registerTask('stop', ['shell:stop']);
    grunt.registerTask('down', ['shell:down']);
    grunt.registerTask('default', ['build']);
}
