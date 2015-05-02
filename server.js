// restful api for crawler
// var abcd = require('node-crawler');
// console.log(abcd.Crawler);
var port = 8085;

var express = require('express');
var app = express();
var http = require("http");
var server = http.createServer(app);

server.listen(port);

// var http = require('http');
// http.createServer(function (request, response) {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Hello World\n');
// }).listen(9999, '127.0.0.1');
console.log('Server running at http://127.0.0.1:' + port + '/');