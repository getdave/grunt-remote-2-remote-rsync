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

	var _ = grunt.util._;

	var SHARED_OPTIONS = [],
		tmp_dir;

	/**
	 * SYNC STAGE TO PRODUCTION
	 *
	 * Group of tasks used to sync a Stage environment with a Production
	 * environment. Requires 2 async "helper" tasks to pull remote to local
	 * and then push resulting local to remote. Clean up afterwards.
	 */
	grunt.task.registerMultiTask('remote_2_remote_rsync', function() {

		// We assume we always want to use SSH mode
		SHARED_OPTIONS = _.extend(this.options(), {
			ssh: true
		});

		// Set the temp directory for the task
		tmp_dir = "./tmp/";

		// Run the rsync task 
		// 1st time = sync remote to local
		// 2nd time = sync local to remote
		grunt.task.run(['r2r_sync_remote:pull', 'r2r_sync_remote:push']);
	});


	grunt.task.registerTask("r2r_sync_remote", "Sync with a remote via push or pull", function(direction) {

		// Copy global options by value not by reference
		var shared_options = _.clone(SHARED_OPTIONS,true),
			task_options;

		// Set src/dest as appropriate to the "direction" in which data is being moved
		if (direction === "pull") {
			task_options = _.extend(shared_options, {
				dest: tmp_dir
			});
		} else {
			task_options = _.extend(shared_options, {
				src: tmp_dir
			});
		}

		// Notify user of actions being taken
		grunt.log.subhead("rsyncing " + task_options.src + " >>> " + task_options.dest );


		// Set this task to run async 
		var done = this.async();

		// Run rsync task with task_options defined above
		rsync(task_options, function (error,stdout,stderr,cmd) {
			grunt.log.writeln("Shell command was: " + cmd);
			if ( error ) {
				// failed
				grunt.log.error();
				grunt.log.writeln(error.toString().red);
				done(false);
			} else {
				// success
				grunt.log.ok("rsync " + task_options.src + " >>> " + task_options.dest + " successfully completed.");
				done(true);

				// Clean up if operation has finished
				if (direction === "push") {
					grunt.file.delete('./tmp/');
				}
			}
		});
	});
};
