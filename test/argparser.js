'use strict';

var assert = require("assert");
var ArgParser = require('../lib/ArgParser').ArgParser;

describe('ArgParser', function() {
	describe('parse', function() {

		it('should show syntax on no args', function () {
			assert.equal(ArgParser.parse([]).showsyntax, true);
			assert.equal(ArgParser.parse().showsyntax, true);
			assert.equal(ArgParser.parse(null).showsyntax, true);
		});

		it('should not show errors on no args', function () {
			assert.equal(ArgParser.parse([]).showerrors, false);
		});

		it('should correctly parse input before \"then\"', function () {
			var t = ArgParser.parse(['a', 'b', 'c', 'then']);
			assert.deepEqual(t.watch, ['a', 'b', 'c']);
		});

		it('should correctly ignore blanks before \"then\"', function () {
			var t = ArgParser.parse(['a', ' ', '', 'b',  'c', 'then']);
			assert.deepEqual(t.watch, ['a', 'b', 'c']);
		});

		it('should correctly parse inputs as filemasks without \"then\"', function () {
			var t = ArgParser.parse(['a', 'bc']);
			assert.deepEqual(t.watch, ['a', 'bc']);
		});

		it('should correctly parse input after \"then\"', function () {
			var t = ArgParser.parse(['then', 'a', 'b', 'c', 'x']);
			assert.deepEqual(t.execute, ['a', 'b', 'c', 'x']);
		});

		it('should correctly ignore blanks input after \"then\"', function () {
			var t = ArgParser.parse(['then', 'ab', '', 'c', ' ', 'then']);
			assert.deepEqual(t.execute, ['ab', 'c', 'then']);
		});
	});

	describe('validate', function() {

		it('should pass through showsyntax + showsyntax', function () {
			var v = ArgParser.validate({
				showsyntax: false,
				showerrors: false,
			});
			assert.equal(v.showsyntax, false);
			assert.equal(v.showerrors, false);
		});

		it('should return errors if input is bad', function () {
			var v = ArgParser.validate({ });
			assert.equal(v.errors.length > 0, true);
		});

		it('should return an error if too low delay', function () {
			var v = ArgParser.validate({
				delay: 3,
				watch: [ 'file1', 'file2' ],
				execute: [ 'cmd1', 'cmd2' ]
			});
			assert.equal(v.errors.length, 1);
		});


		it('should return an error if no file masks present', function () {
			var v = ArgParser.validate({
				execute: [ 'cmd1', 'cmd2' ]
			});
			assert.equal(v.errors.length, 1);
		});

		it('should return an error if no execution steps present', function () {
			var v = ArgParser.validate({
				watch: [ 'file1', 'file2' ],
			});
			assert.equal(v.errors.length, 1);
		});

		it('should return no error if input is valid', function () {
			var v = ArgParser.validate({
				watch: [ 'file1', 'file2' ],
				execute: [ 'cmd1', 'cmd2' ]
			});
			assert.equal(v.errors.length, 0);
		});

	});
});
