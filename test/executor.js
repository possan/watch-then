'use strict';

var assert = require("assert");
var Executor = require('../lib/Executor').Executor;
var Q = require('q');

describe('Executor', function() {

	describe('debounce', function() {
		it('should wait with execution and debounce multiple ones', function(done) {
			var teststep = 0;
			var testvalue = 0;
			var ex = new Executor({ delay: 50 });
			ex._actualExecute = function() {
				var future = Q.defer();
				testvalue ++;
				future.resolve(true);
				return future.promise;
			};
			ex.execute();
			ex.execute();
			ex.execute();
			setTimeout(function() {
				ex.execute();
				ex.execute();
				ex.execute();
			}, 200);
			setTimeout(function() {
				assert.equal(testvalue, 2);
				done();
			}, 500);
		});

		it('should wait until first one has executed before starting another one', function(done) {
			var future;
			var teststep = 0;
			var testvalue = 0;
			var ex = new Executor({ delay: 50 });
			ex._actualExecute = function() {
				testvalue ++;
				return future.promise;
			};

			future = Q.defer();
			// fire it a couple of times
			ex.execute();
			ex.execute();
			setTimeout(function() {
				// execute should have fired once at this point.
				assert.equal(testvalue, 1);
				// fire it again
				ex.execute();
			}, 200);
			setTimeout(function() {
				// future should not have fired again since the first haven't resolved yet.
				assert.equal(testvalue, 1);
				// resolve it.
				future.resolve(true);
			}, 300);
			setTimeout(function() {
				// future should not have fired again.
				assert.equal(testvalue, 1);
			}, 400);
			setTimeout(function() {
				// fire it again.
				ex.execute();
			}, 500);
			setTimeout(function() {
				// future should not fire again.
				assert.equal(testvalue, 2);
				done();
			}, 700);
		});
	});
});
