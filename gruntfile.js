require("dotenv").config();

module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-webpack");

  const notifier = require("node-notifier");
  const empty = require("is-empty");

  const paths = {
    bootstrap: "./node_modules/bootstrap/"
  };

  // These are some include paths that we might use in some of the files. This
  // allows us to, for instance, say @include "font-awesome" and have it
  // resolved into the file here when we build it.
  const includePaths = [
    paths.bootstrap + "scss/"
  ];

  grunt.loadNpmTasks("grunt-shell");

  grunt.initConfig({
    shell: {
      clean: {
        command:
          "find ./build ! -name '.gitignore' -mindepth 1 -maxdepth 1 -exec rm -rf {} +",
      },
      buildDocker: {
        command: [
          "find ./dystill-web/storage/logs ! -name '.gitignore' -type f -exec rm -f {} +",
          "docker-compose build",
        ].join(" && "),
      },
      buildComposer: {
        command: "cd ./build && composer install --no-dev",
      },
      deployDocker: {
        command: [
          "docker tag " +
            process.env.DOCKER_REPO +
            " " +
            process.env.DOCKER_REGISTRY +
            "/" +
            process.env.DOCKER_REPO,
          "docker push " +
            process.env.DOCKER_REGISTRY +
            "/" +
            process.env.DOCKER_REPO,
        ].join(" && "),
      },
      up: {
        command: "docker-compose -f docker-compose.yml up",
      },
      stop: {
        command: "docker-compose -f docker-compose.yml stop",
      },
      down: {
        command: "docker-compose -f docker-compose.yml down",
      },
    },

    sass: {
      options: {
        implementation: require("node-sass"),
        sourceMap: true,
        sourceComments: false,
        outputStyle: "compressed",
        includePaths: includePaths,
        precision: 5,
        linefeed: "lf",
      },
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: "./",
            src: ["./dystill-web/resources/sass/**.scss"],
            dest: "./build/public/css",
            ext: ".min.css",
          },
        ],
      },
    },
    copy: {
      appEnv: {
        files: [
          {
            cwd: "./",
            src: "dystill-web/.env",
            dest: "./build/.env",
          },
        ],
      },
      laravel: {
        files: [
          {
            cwd: "./dystill-web/app",
            src: "**/*",
            dest: "./build/app",
            expand: true,
          },
          {
            cwd: "./dystill-web/bootstrap",
            src: ["*.php", "cache"],
            dest: "./build/bootstrap",
            expand: true,
          },
          {
            cwd: "./dystill-web/config",
            src: "**/*",
            dest: "./build/config",
            expand: true,
          },
          {
            cwd: "./dystill-web/routes",
            src: "**/*",
            dest: "./build/routes",
            expand: true,
          },
          {
            cwd: "./dystill-web/database",
            src: "**/*",
            dest: "./build/database",
            expand: true,
          },
          {
            cwd: "./dystill-web/public",
            src: [
              "css",
              "fonts",
              "img",
              "js",
              "templates",
              "index.php",
              ".htaccess",
              "robots.txt",
            ],
            dest: "./build/public",
            expand: true,
          },
          {
            cwd: "./dystill-web/resources",
            src: ["lang/**/*", "views/**/*"],
            dest: "./build/resources",
            expand: true,
          },
          {
            cwd: "./dystill-web/storage",
            src: [
              "app",
              "custom_handlers",
              "files",
              "framework/cache",
              "framework/sessions",
              "framework/views",
              "graphics",
              "logs",
            ],
            dest: "./build/storage",
            expand: true,
          },
          {
            cwd: "./dystill-web",
            src: ["artisan", "server.php"],
            dest: "./build",
            expand: true,
          },
        ],
      },
      composer: {
        files: [
          {
            cwd: "./dystill-web",
            src: ["composer.json", "composer.lock"],
            dest: "./build",
            expand: true,
          },
        ],
      },
      npmFiles: {
        files: [
          // JS
          {
            src: paths.bootstrap + "javascripts/bootstrap.min.js",
            dest: "./build/public/js/bootstrap.min.js",
          },
          {
            src: paths.jquery + "jquery.min.js",
            dest: "./build/public/js/jquery.min.js",
          },

          // Fonts
          {
            src: paths.fontawesome + "webfonts/*",
            dest: "./build/public/fonts/",
            flatten: true,
            expand: true,
          },
        ],
      },
      favicons: {
        files: [
          {
            expand: true,
            flatten: true,
            src: paths.assets + "favicons/*",
            dest: "public",
          },
        ],
      },
    },

    webpack: {
      config: require("./webpack.config")
    }
  });

  function runAndNotify(task, message) {
    grunt.task.run(task);
    notifier.notify({
      title: "Build Complete",
      message: message,
    });
  }

  grunt.registerTask("watch:sass", function () {
    runAndNotify("build:sass", "SCSS built.");
  });

  grunt.registerTask("watch:laravel", function () {
    runAndNotify("build:laravel", "Laravel sources built.");
  });

  grunt.registerTask("build:sass", ["sass"]);
  grunt.registerTask("build:docker", ["shell:buildDocker"]);
  grunt.registerTask("build:laravel", ["copy:laravel"]);
  grunt.registerTask("build:build", [
    "clean",
    "copy:laravel",
    "copy:npmFiles",
    "copy:composer",
    "shell:buildComposer",
    "build:sass",
    "webpack"
  ]);

  grunt.registerTask("build", ["build:build", "build:docker"]);

  // So grunt-contrib-watch squats on the 'watch' task name. But we want to
  // use that. So we define our own watch task. This task immediately renames
  // itself, then loads the actual contrib task to run. I can't believe this
  // actually works.
  grunt.registerTask("watch", function () {
    grunt.renameTask("watch", "foo");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.config.set("watch", {
      laravel: {
        files: "dystill-web/**/*.php",
        tasks: "watch:laravel",
      },

      vue: {
        files: ["dystill-web/**/*.js", "dystill-web/**/*.vue"],
        tasks: "webpack"
      },

      sass: {
        files: ["dystill-web/**/*.scss"],
        tasks: "watch:sass",
      },
    });

    grunt.task.run("build:build");
    grunt.task.run("copy:appEnv");
    grunt.task.run("watch");
  });

  grunt.registerTask("init", function () {
    grunt.task.run("shell:init");
  });

  grunt.registerTask("clean", ["shell:clean"]);
  grunt.registerTask("deploy", ["shell:deployDocker"]);
  grunt.registerTask("up", ["shell:up"]);
  grunt.registerTask("stop", ["shell:stop"]);
  grunt.registerTask("down", ["shell:down"]);
  grunt.registerTask("default", ["build"]);
};
