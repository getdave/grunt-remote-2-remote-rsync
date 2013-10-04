'use strict';

var grunt = require('grunt');

var chai        = require("chai");
var expect      = require('chai').expect;

// Chai ref - http://chaijs.com/api/bdd/
// Mocha ref - http://visionmedia.github.io/mocha/

describe('Single file transfers', function(){

  after(function(){

  });

  it('should be able to read the transfered file', function(){
      var file    = './test/faux-remote/testing.txt';
      expect(file).to.exist;
  });

  it('should match the content of the test data file', function(){
      var actual    = grunt.file.read('./test/faux-remote/testing.txt');
      var expected  = grunt.file.read('./test/fixtures/testing.txt');
      expect(actual).to.equal(expected);
  });  
});


describe('Multiple file transfers', function(){

  after(function(){
    grunt.file.delete('./test/faux-remote/');
  });

  it('should be able to read all of the transfered files', function() {
      grunt.file.recurse("./test/fixtures/multiple/", function(abspath, rootdir, subdir, filename) {
        var file = './test/faux-remote/multiple/' + filename;
        expect(file).to.exist;
      });
  });

  it('should match the content of the test dates files', function() {
      grunt.file.recurse("./test/fixtures/multiple/", function(abspath, rootdir, subdir, filename) {
        var expected  = grunt.file.read('./test/faux-remote/multiple/' + filename);
        var actual    = grunt.file.read(abspath);
        
        expect(actual).to.equal(expected);
      });
  });
  
});


/* describe('True remote transfers', function(){

  it('should be able to read all of the transfered files', function() {
      grunt.file.recurse("./test/fixtures/multiple/", function(abspath, rootdir, subdir, filename) {
        var file = './test/faux-remote/multiple/' + filename;
        expect(file).to.exist;
      });
  });

  it('should match the content of the test dates files', function() {
      grunt.file.recurse("./test/fixtures/multiple/", function(abspath, rootdir, subdir, filename) {
        var expected  = grunt.file.read('./test/faux-remote/multiple/' + filename);
        var actual    = grunt.file.read(abspath);
        
        expect(actual).to.equal(expected);
      });
  });
  
}); */
