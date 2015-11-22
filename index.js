// ----- Setup ----- //

// The request types and their response messages.
let REQUESTS = {
	create: {
		success: 'created',
		failure: 'create_fail'
	},
	retrieve: {
		success: 'retrieved',
		failure: 'retrieve_fail'
	},
	update: {
		success: 'updated',
		failure: 'update_fail'
	},
	'delete': {
		success: 'deleted',
		failure: 'delete_fail'
	}	
};

// The fields that appear in a request.
let REQUEST_FIELDS = ['action', 'data_type', 'payload', 'message_info'];

// The error messages corresponding to failed requests.
let MALFORMED_REQUESTS = {
	'JSON': 'JSON malformed.',
	TYPE: 'Invalid request type.',
	FIELDS: 'Invalid request fields.'
};


// ----- Functions ----- //

// Creates an API response of the correct format.
function buildResponse (response, data_type, payload, info) {

	let message = {
		response: response,
		data_type: data_type || null,
		payload: payload || null,
		message_info: info || null
	};

	try {
		return JSON.stringify(message);
	} catch (err) {
		throw new Error(`Problem building response: ${err.message}`);
	}

}

// Creates a response for a malformed API request.
function malformedRequest (error) {

	let payload = MALFORMED_REQUESTS[error];

	let errRes = buildResponse('malformed-request', null, payload);

	return { success: false, err_response: errRes };

}

// Checks for problems with the request.
function checkRequest (request) {

	let requestFields = Object.keys(request);

	// Checks the correct fields are present.
	if (REQUEST_FIELDS.every(field => requestFields.indexOf(field) >= 0)) {

		// Checks the request type is permitted.
		if (REQUESTS.indexOf(request.action) >= 0) {
			return { success: true, result: request };
		} else {
			return malformedRequest('TYPE');
		}

	} else {
		return malformedRequest('FIELDS');
	}

}

// Creates a response from an API request.
function response (request, success, payload, info) {

	let action = request.action;
	let response_type = null;

	if (success) {
		response_type = REQUESTS[action].success;
	} else {
		response_type = REQUESTS[action].failure;
	}

	return buildResponse(response_type, request.data_type, payload, info);

}



// ----- Exports ----- //

module.exports = {
	response: response
};
