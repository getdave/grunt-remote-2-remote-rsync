/*
 * grunt-remote-2-remote-rsync
 * https://github.com/getdave/grunt-remote-2-remote-rsync
 *
 * Copyright (c) 2013 David Smith
 * Licensed under the MIT license.
 */

'use strict';

var path        = require('path');
var rsync       = require("rsyncwrapper").rsync;
var chai        = require("chai");
var expect      = require('chai').expect;







module.exports = function(grunt) {

    var SHARED_OPTIONS = [];

    /**
     * SYNC STAGE TO PRODUCTION
     *
     * Group of tasks used to sync a Stage environment with a Production
     * environment. Requires 2 async "helper" tasks to pull remote to local
     * and then push resulting local to remote. Clean up afterwards.
     */
    grunt.task.registerMultiTask('remote_2_remote_rsync', function() {
        SHARED_OPTIONS = this.options();

        grunt.task.run(['r2r_sync_stage_to_tmp', 'r2r_sync_tmp_to_production']);
    });


    grunt.task.registerTask("r2r_sync_stage_to_tmp", "Pull remote 'src' to temp dir", function() {
        grunt.log.subhead("rsyncing " + SHARED_OPTIONS.src + " >>> '/tmp/'." );
        var done = this.async();
        rsync({
            src: SHARED_OPTIONS.src,
            dest: "./tmp/",
            dryRun: SHARED_OPTIONS.dryRun,
            recursive: true,
            ssh: SHARED_OPTIONS.ssh,
            onStdout: function (data) {
                grunt.log.write(data.grey);
            }
        },function (error,stdout,stderr,cmd) {

            grunt.log.writeln("Shell command was: "+cmd);
            if ( error ) {
                // failed
                grunt.log.error();
                grunt.log.writeln(error.toString().red);
                done(false);
            } else {
                // success
                grunt.log.ok("rsync from 'src' successfully completed.");
                done(true);
            }
        });
    });


    grunt.task.registerTask("r2r_sync_tmp_to_production", "Push '/tmp/' dir to remote 'dest'", function() {
        grunt.log.subhead("rsyncing '/tmp/' >>> " + SHARED_OPTIONS.dest + ".");
        var done = this.async();
        rsync({
            src: "./tmp/",
            dest: SHARED_OPTIONS.dest,
            dryRun: SHARED_OPTIONS.dryRun,
            recursive: true,
            ssh: SHARED_OPTIONS.ssh,
            onStdout: function (data) {
                grunt.log.write(data.grey);
            }
        },function (error,stdout,stderr,cmd) {

            grunt.log.writeln("Shell command was: "+cmd);
            if ( error ) {
                // failed
                grunt.log.error();
                grunt.log.writeln(error.toString().red);
                done(false);
                // Clean up
                grunt.file.delete('./tmp/');
            } else {
                // success
                grunt.log.ok('rsync to Production successfully completed.');
                done(true);

                // Clean up
                grunt.file.delete('./tmp/');
            }
        });   
    });

};
