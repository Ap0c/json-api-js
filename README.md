JSON API - Javascript
=====================

A simple, structured JSON API written in Javascript, for communication between apps in a network. View the Python version [here](https://github.com/Ap0c/json-api-py).

## To Use

```js
var api = require('json-api');

// Receive a JSON request on the server.
var request = receiveJsonRequest();

// Decode the request.
var decodedRequest = api.decodeRequest(request);

// Do things that the user has requested.
var responseData = doSomeStuff(decodedRequest);

var response = '';

// Send back a success response, optionally with requested data,
// or send back a failure response.
if (stuffSuccessful) {
    response = api.response(decodedRequest, true, responseData);
} else {
    response = api.response(decodedRequest, false);
}

sendOffResponse(response);

```

## Request Format

All JSON requests made to an application using this API must have the following four fields:

- `action`: The request verb, either 'create', 'retrieve', 'update' or 'delete'.
- `data_type`: The expected data type of the response. The implementation of this is left up to the developer, but examples might include: integer, string, object, array, etc.
- `payload`: The data payload that comes with the request.
- `message_info`: Designed for additional data about the request that it is not appropriate to include within the payload.

All fields apart from `action` are allowed to be `null`.

## Response Format

The format of a response is very similar to that of a request, and is comprised of the following four fields:

- `response`: A response verb that mirrors that of the corresponding request, may be any one of the following:
    + `created`: For a successful `create` request.
    + `create_fail`: For a failed `create` request.
    + `retrieved`: For a successful `retrieve` request.
    + `retrieve_fail`: For a failed `retrieve` request.
    + `updated`: For a successful `update` request.
    + `update_fail`: For a failed `update` request.
    + `deleted`: For a successful `delete` request.
    + `delete_fail`: For a failed `delete` request.
    + `malformed-request`: A special response type that is generated automatically when the request received does not meet the above formatting criteria.
- `data_type`: The data type of the response. As before, the implementation is left up to the developer.
- `payload`: The data payload that comes with the response.
- `message_ingo`: Designed for additional data about the response that it is not appropriate to include within the payload.

All fields apart from `response` may be `null`.

## API

### api.decodeRequest(*request*)

Takes a JSON-encoded API request, checks it for the correct format, and returns the equivalent js object. If there are any problems, returns a ready-made JSON response detailing this.

- `request`: A JSON-encoded API request.

Return object is either of the form:

```js
{ success: true, result: <request_object> }
```

or:

```js
{ success: false, err_response: <json_response> }
```

### api.response(*request*, *success*, *[payload]*, *[info]*)

Builds a JSON-encoded API response from a given request object (Note: takes a decoded request object, not a JSON-encoded one). It requires a request success status and can optionally take a data payload and additional info as long as they are JSON-serialisable.

- `request`: An API request object, specifically one that has been decoded previously by the `decodeRequest` function.

- `success`: Boolean indicating whether the request was successful or not.

- `payload` (*optional*): A data payload of some form that is being returned as part of the response. Must be JSON-serialisable.

- `info` (*optional*): Additional info about the response that, for whatever reason, does not belong in the payload. Must be JSON-serialisable.
