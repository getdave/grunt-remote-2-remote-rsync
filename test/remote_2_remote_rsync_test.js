'use strict';

var grunt = require('grunt');

var chai        = require("chai");
var expect      = require('chai').expect;

// Chai ref - http://chaijs.com/api/bdd/
// Mocha ref - http://visionmedia.github.io/mocha/

describe('Basic file transfers', function(){

  after(function(){
    grunt.file.delete('./test/faux-remote/');
  });

  it('should be able to read transffered file', function(){
      var file    = grunt.file.read('./test/faux-remote/testing.txt');
      expect(file).to.exist;
  });

  it('should match the test data file', function(){
      var actual    = grunt.file.read('./test/faux-remote/testing.txt');
      var expected  = grunt.file.read('./test/fixtures/testing.txt');
      expect(actual).to.equal(expected);
  });

  
});
