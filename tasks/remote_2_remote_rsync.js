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
		SHARED_OPTIONS = this.options();
		tmp_dir = "./tmp/";

		grunt.task.run(['r2r_sync_remote_to_tmp', 'r2r_sync_tmp_to_remote']);
		
		
	});


	grunt.task.registerTask("r2r_sync_remote_to_tmp", "Pull remote 'src' to temp dir", function() {

		var shared_options = _.clone(SHARED_OPTIONS,true);

		var task_options = _.extend(shared_options, {
			dest: tmp_dir
		});

		

		grunt.log.subhead("rsyncing " + task_options.src + " >>> " + task_options.dest );



		var done = this.async();
		rsync(task_options, function (error,stdout,stderr,cmd) {
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


	grunt.task.registerTask("r2r_sync_tmp_to_remote", "Push '/tmp/' dir to remote 'dest'", function() {
		var done = this.async();

		var shared_options = _.clone(SHARED_OPTIONS,true);

		var task_options = _.extend(shared_options,{
			src: tmp_dir
		});

		grunt.log.subhead("rsyncing " + task_options.src + " >>> " + task_options.dest);



		rsync(task_options, function (error,stdout,stderr,cmd) {

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
