var expresss = require('express')
	, qs = require('querystring')
	, request = require('supertest')
	,	fetcher = require('../');

describe('It can ', function() {
	var app;

	beforeEach(function (done) {
		app = expresss();
		app.use(fetcher());
		done();
	});

	it('receive error code.', function(done) {
		var options;
		app.get('/path/:id', function(req, res, next) {
			var required = ['{id}', 'type', 'order'];

			options = req.fetchParameter(required, []);

			if (req.checkParamErr(options)) return next(options);

			return res.status(200).send(options);
		});

		app.use(function(err, req, res, next) {
			return res.status(err.code).send(err.message);
		});

		request(app)
			.get('/path/10')
			.expect(400, done);
	});
});
