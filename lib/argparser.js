'use strict';

var ArgParser = function() {}

ArgParser.parse = function(args) {
	var ret = {
		delay: 500,
		showsyntax: false,
		showerrors: false,
		watch: [],
		execute: []
	}

	var state = 'before-then';

	args && args.forEach(function(x) {
		x = x.trim();
		if (x == '')
			return;

		if (state == 'before-then') {
			if (x == 'then') {
				state = 'after-then';
				return;
			}
			ret.watch.push(x);
		}

		if (state == 'after-then') {
			ret.execute.push(x);
		}
	});

	if (ret.watch.length == 0 || ret.execute.length == 0)
		ret.showsyntax = true;

	if (args && args.length > 0)
		ret.showerrors = true;

	return ret;
}

ArgParser.validate = function(config) {
	var ret = {
		valid: false,
		showsyntax: config && config.showsyntax || false,
		showerrors: config && config.showerrors || false,
		delay: config && config.delay || 1000,
		errors: [],
		watch: config && config.watch || [],
		execute: config && config.execute || []
	}

	if (ret.delay < 100) {
		ret.errors.push('You should at least have a execution delay of 100ms.');
	}

	if (ret.watch.length < 1) {
		ret.errors.push('No files to watch specified.');
	}

	if (ret.execute.length < 1) {
		ret.errors.push('No commands to execute specified.');
	}

	ret.valid = ret.errors > 0;

	return ret;
}

ArgParser.parseAndValidate = function(args) {
	var config = ArgParser.parse(args);
	config = ArgParser.validate(config);
	return config;
}

exports.ArgParser = ArgParser;
