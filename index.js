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
	'TYPE': 'Invalid request type.',
	'FIELDS': 'Invalid request fields.'
};
