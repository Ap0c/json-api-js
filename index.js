'use strict';

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

// The fields that appear in a response.
let RESPONSE_FIELDS = ['response', 'data_type', 'payload', 'message_info'];

// The error messages corresponding to failed requests.
let MALFORMED_REQUESTS = {
	'JSON': 'JSON malformed.',
	TYPE: 'Invalid request type.',
	FIELDS: 'Invalid request fields.'
};

// The error messages corresponding to problematic responses.
let MALFORMED_RESPONSES = {
	'JSON': 'JSON malformed.',
	'TYPE': 'Invalid response type.',
	'FIELDS': 'Invalid response fields.'
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
		if (REQUESTS.hasOwnProperty(request.action)) {
			return { success: true, result: request };
		} else {
			return malformedRequest('TYPE');
		}

	} else {
		return malformedRequest('FIELDS');
	}

}

// Checks for problems with a received response.
function checkResponse(request, response) {

	let responseFields = Object.keys(request);

	// Checks the correct response fields are present.
	if (RESPONSE_FIELDS.every(field => responseFields.indexOf(field) >= 0)) {

		let allowed_responses = Object.keys(REQUESTS[request.action]);
		allowed_responses.push('malformed-request');

		// Checks the response type is permitted.
		if (allowed_responses.indexOf(response.response) >= 0) {
			return {success: true, result: request};
		} else {
			return {success: false, error: MALFORMED_RESPONSES.TYPE};
		}

	} else {
		return {success: false, error: MALFORMED_RESPONSES.FIELDS};
	}

}

// Creates a response from an API request.
function response (request, success, payload, info) {

	let action = request.action;
	let responseType = null;

	if (success) {
		responseType = REQUESTS[action].success;
	} else {
		responseType = REQUESTS[action].failure;
	}

	return buildResponse(responseType, request.data_type, payload, info);

}

// Decodes the JSON in an API request.
function decodeRequest (request, parsed) {

	if (parsed) {

		return checkRequest(request);

	} else {

		let apiRequest = null;

		try {
			apiRequest = JSON.parse(request);
		} catch (err) {
			return malformedRequest('JSON');
		}

		return checkRequest(apiRequest);

	}

}

// Creates a JSON request.
function request (action, dataType, payload, info) {

	if (REQUESTS.hasOwnProperty(action)) {

		let message = {
			action: action,
			dataType: dataType || null,
			payload: payload || null,
			message_info: info || null
		};

		try {
			return {request: JSON.stringify(message), requestObj: message};
		} catch (err) {
			throw new Error(`Problem building request: ${err.message}`);
		}

	} else {
		throw new Error(`Request verb not permitted: ${action}`);
	}

}

// Decodes the JSON in an API response.
function decodeResponse(request, response) {

	let apiResponse = null;

	try {
		apiResponse = JSON.parse(response);
	} catch (err) {
		return {success: false, error: MALFORMED_RESPONSES.JSON};
	}

	return checkResponse(request, apiResponse);

}

// ----- Exports ----- //

module.exports = {
	response: response,
	decodeRequest: decodeRequest,
	request: request,
	decodeResponse: decodeResponse
};
