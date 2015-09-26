'use strict';

var chokidar = require('chokidar');
var Q = require('q');

var App = function() {}

App.prototype.head = function() {
	console.log('watch-then v0.0.1');
	console.log();
}

App.prototype.help = function() {
	console.log('Syntax:');
	console.log('  watch [filemask] {filemask2...} then [command1] {command2...}');
	console.log();
}

App.prototype.run = function(config, executor) {
	if (config.showsyntax) {
		this.head();
	}

	if (config.showerrors && config.errors.length > 0) {
		config.errors.forEach(function(err) {
			console.log('Error: ' + err);
		});
		console.log();
	}

	if (config.showsyntax) {
		this.help();
		return;
	}

	chokidar.watch(config.watch).on('change', function(path, stats) {
		console.log('File changed: ' + path);
		executor.execute();
	});
}

exports.App = App;
