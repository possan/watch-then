'use strict';

var chokidar = require('chokidar');
var Q = require('q');
var child_process = require('child_process');

var Executor = function(config) {
	this.config = config;
	this.timer = 0;
	this.lastpromise = false;
}

Executor.prototype._executeSingle = function(cmd) {
	var future = Q.defer();

    var proc = child_process.exec(cmd, {}, null);
    proc.stdout.on('data', function (d) { console.log(d); });
    proc.stderr.on('data', function (d) { console.error(d); });

    proc.on('error', function (err) {
		future.reject(err);
    });

    proc.on('exit', function(code) {
		if (code != 0) {
			future.reject('exit ' + code);
		} else {
			future.resolve(true);
	    }
    });

	return future.promise;
}

Executor.prototype._actualExecute = function() {
	var _this = this;
	var future = Q.defer();

	function executeNext(index) {
		if (index >= _this.config.execute.length) {
			future.resolve(true); // resolve all successfully.
			return;
		};

		var cmd = _this.config.execute[index];
		_this._executeSingle(cmd).then(function() {
			executeNext(index + 1);
		}).catch(function(err) {
			// stop early.
			future.reject(err);
			return;
		});
	}

	executeNext(0);

	return future.promise;
}

Executor.prototype.debouncedExecute = function() {
	if (this.timer) {
		clearTimeout(this.timer);
		this.timer = 0;
	}
	var _this = this;
	this.timer = setTimeout(function() {
		if (_this.lastpromise) {
			// still waiting for a previous promise, keep waiting and just ignore requests...
			return;
		}

		// console.log('Executing...');
		_this.lastpromise = _this._actualExecute();
		_this.lastpromise.then(function(result) {
			// console.log('Execution done.');
			_this.lastpromise = null;
		}).catch(function(err) {
			console.log('Execution failed.', err);
			_this.lastpromise = null;
		})
	}, this.config.delay);
}

Executor.prototype.execute = function() {
	this.debouncedExecute();
}

exports.Executor = Executor;
