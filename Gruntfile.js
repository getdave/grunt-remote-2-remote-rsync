/*
 * grunt-remote-2-remote-rsync
 * https://github.com/getdave/grunt-remote-2-remote-rsync
 *
 * Copyright (c) 2013 David Smith
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {


  var secret = {};
  try {
    secret = grunt.file.readYAML('./test/secret.yaml');
  } catch (err) {
  }

  // Project configuration.
  grunt.initConfig({

    // Capture on grunt init()
    secret: secret,


    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    shell: {
      tmpdir : {
          command: "mkdir test/faux-remote"
      }
    },
    clean: {
      tmp: ["test/faux-remote"]
    },

    // Configuration to be run (and then tested).
    remote_2_remote_rsync: {
      options: {
        args: [
            "-avzh",
            "--progress",
        ],
        recursive: true,
        syncDest: false
      },
      single: {
        options: {
            src: "./test/fixtures/testing.txt",
            dest: "./test/faux-remote/",
        },
      },
      multiple: {
        options: {
            src: "./test/fixtures/multiple/",
            dest: "./test/faux-remote/multiple/",
        },
      },
      true_ssh: {
        options: {
          src:  "<%= secret.src.user %>" + "@" + "<%= secret.src.host %>" + ":" + "<%= secret.src.dir %>",
          dest:  "<%= secret.dest.user %>" + "@" + "<%= secret.dest.host %>" + ":" + "<%= secret.dest.dir %>",
        }
      }
    },

    // Unit tests.
    simplemocha: {
        options: {
            globals: ['chai'],
            reporter: 'Nyan', // YES!!!!!
        },

        all: {
            src: [
              'node_modules/chai/lib/chai.js',
              'test/**/*.js'
            ]
        }
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'shell:tmpdir', 'remote_2_remote_rsync', 'simplemocha']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
