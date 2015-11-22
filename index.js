// ----- Setup ----- //

// The request types and their response messages.
var REQUESTS = {
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
var REQUEST_FIELDS = ['action', 'data_type', 'payload', 'message_info'];

// The error messages corresponding to failed requests.
var MALFORMED_REQUESTS = {
	'JSON': 'JSON malformed.',
	TYPE: 'Invalid request type.',
	FIELDS: 'Invalid request fields.'
};


// ----- Functions ----- //

// Creates an API response of the correct format.
function buildResponse (response, data_type, payload, info) {

	var message = {
		response: response,
		data_type: data_type,
		payload: payload,
		message_info: info
	};

	try {
		return JSON.stringify(message);
	} catch (err) {
		throw new Error(`Problem building response: ${err.message}`);
	}

}
