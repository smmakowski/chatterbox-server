/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Cheeck out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fileSystem = require('fs');
var path = require('path');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var storage = {results: [
  {
    createdAt: '2017-02-27T23:49:53.511Z',
    objectId: 'JbwGaKUfUk',
    roomname: 'lobby',
    text: 'fsadfdsa',
    username: 'apple',
    updatedAt: '2017-02-27T23:49:53.511Z'
  }
]};
var counter = 0;

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  

  // storage
  

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  

  if (request.url.slice(0, 17) !== '/classes/messages' && request.url.slice(0, 14) !== '/classes/room') {
    statusCode = 404;
    response.writeHead(statusCode, headers);
  }

  if (request.method === 'POST' && statusCode !== 404) {
    statusCode = 201;
    response.writeHead(statusCode, headers);
    request.on('data', function(chunk) {
      var data = chunk.toString().split('&');
      if (data.length === 1) {
        storage.results.push({objectId: 'JbwGaKUfUj' + counter, username: data[0].username, text: data[0].message, createdAt: new Date().toISOString()});
      } else {
        storage.results.push({objectId: 'JbwGaKUfUj' + counter, username: data[0].split('=')[1], text: data[1].split('=')[1].split('+').join(' '), roomname: data[2].split('=')[1], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()});
      }
    });
    counter++;
  }
  response.writeHead(statusCode, headers);
  // console.log(storage.results);
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(JSON.stringify(storage));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports.requestHandler = requestHandler;
module.exports.defaultCorsHeaders = defaultCorsHeaders;
