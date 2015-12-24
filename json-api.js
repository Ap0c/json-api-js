(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jsonApi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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

// The fields that appear in a response.
var RESPONSE_FIELDS = ['response', 'data_type', 'payload', 'message_info'];

// The error messages corresponding to failed requests.
var MALFORMED_REQUESTS = {
	'JSON': 'JSON malformed.',
	TYPE: 'Invalid request type.',
	FIELDS: 'Invalid request fields.'
};

// The error messages corresponding to problematic responses.
var MALFORMED_RESPONSES = {
	'JSON': 'JSON malformed.',
	'TYPE': 'Invalid response type.',
	'FIELDS': 'Invalid response fields.'
};

// ----- Functions ----- //

// Creates an API response of the correct format.
function buildResponse(response, data_type, payload, info) {

	var message = {
		response: response,
		data_type: data_type || null,
		payload: payload || null,
		message_info: info || null
	};

	try {
		return JSON.stringify(message);
	} catch (err) {
		throw new Error(`Problem building response: ${ err.message }`);
	}
}

// Creates a response for a malformed API request.
function malformedRequest(error) {

	var payload = MALFORMED_REQUESTS[error];

	var errRes = buildResponse('malformed-request', null, payload);

	return { success: false, err_response: errRes };
}

// Checks for problems with the request.
function checkRequest(request) {

	var requestFields = Object.keys(request);

	// Checks the correct fields are present.
	if (REQUEST_FIELDS.every(function (field) {
		return requestFields.indexOf(field) >= 0;
	})) {

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

	var responseFields = Object.keys(response);

	// Checks the correct response fields are present.
	if (RESPONSE_FIELDS.every(function (field) {
		return responseFields.indexOf(field) >= 0;
	})) {

		var responses = REQUESTS[request.action];
		var allowedResponses = [responses.success, responses.failure, 'malformed-request'];

		// Checks the response type is permitted.
		if (allowedResponses.indexOf(response.response) >= 0) {
			return { success: true, result: request };
		} else {
			return { success: false, error: MALFORMED_RESPONSES.TYPE };
		}
	} else {
		return { success: false, error: MALFORMED_RESPONSES.FIELDS };
	}
}

// Creates a response from an API request.
function response(request, success, payload, info) {

	var action = request.action;
	var responseType = null;

	if (success) {
		responseType = REQUESTS[action].success;
	} else {
		responseType = REQUESTS[action].failure;
	}

	return buildResponse(responseType, request.data_type, payload, info);
}

// Decodes the JSON in an API request.
function decodeRequest(request, parsed) {

	if (parsed) {

		return checkRequest(request);
	} else {

		var apiRequest = null;

		try {
			apiRequest = JSON.parse(request);
		} catch (err) {
			return malformedRequest('JSON');
		}

		return checkRequest(apiRequest);
	}
}

// Creates a JSON request.
function request(action, dataType, payload, info) {

	if (REQUESTS.hasOwnProperty(action)) {

		var message = {
			action: action,
			data_type: dataType || null,
			payload: payload || null,
			message_info: info || null
		};

		try {
			return { request: JSON.stringify(message), requestObj: message };
		} catch (err) {
			throw new Error(`Problem building request: ${ err.message }`);
		}
	} else {
		throw new Error(`Request verb not permitted: ${ action }`);
	}
}

// Decodes the JSON in an API response.
function decodeResponse(request, response) {

	var apiResponse = null;

	try {
		apiResponse = JSON.parse(response);
	} catch (err) {
		return { success: false, error: MALFORMED_RESPONSES.JSON };
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

},{}]},{},[1])(1)
});