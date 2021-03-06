// ----- Requires ----- //

var expect = require('chai').expect;
var api = require('../index.js');


// ----- Tests ----- //

describe('Tests the request decoding functionality.', function () {

	it('Should produce a request object', function () {

		var request = `{
			"action": "retrieve",
			"data_type": "string",
			"payload": null,
			"message_info": null
		}`;

		var result = api.decodeRequest(request);
		expect(result.success).to.be.true;

		var requestObj = result.result;
		expect(requestObj.action).to.equal('retrieve');
		expect(requestObj.data_type).to.equal('string');
		expect(requestObj.payload).to.be.null;
		expect(requestObj.message_info).to.be.null;

	});

	it('Should produce a malformed JSON response string', function () {

		var request = `{
			"action": "retrieve"
			"data_type": "string",
			"payload": null,
			"message_info": null
		}`;

		var result = api.decodeRequest(request);
		expect(result.success).to.be.false;

		var response = JSON.parse(result.err_response);
		expect(response.response).to.equal('malformed-request');
		expect(response.data_type).to.be.null;
		expect(response.payload).to.equal('JSON malformed.');
		expect(response.message_info).to.be.null;

	});

});
