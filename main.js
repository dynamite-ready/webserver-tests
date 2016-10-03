'use strict';

// Includes...
const express = require('express');
const connect = require('connect');
const Hapi = require('hapi');
const restify = require('restify');
const request = require("request");

// Constants
const totalReq = 100;
const file = '<?xml version="1.0"?> <catalog> <book id="bk101"> <author>Gambardella, Matthew</author> <title>XML Developer\'s Guide</title> <genre>Computer</genre> <price>44.95</price> <publish_date>2000-10-01</publish_date> <description>An in-depth look at creating applications with XML.</description> </book> <book id="bk102"> <author>Ralls, Kim</author> <title>Midnight Rain</title> <genre>Fantasy</genre> <price>5.95</price> <publish_date>2000-12-16</publish_date> <description>A former architect battles corporate zombies, an evil sorceress, and her own childhood to become queen of the world.</description> </book> <book id="bk103"> <author>Corets, Eva</author> <title>Maeve Ascendant</title> <genre>Fantasy</genre> <price>5.95</price> <publish_date>2000-11-17</publish_date> <description>After the collapse of a nanotechnology society in England, the young survivors lay the foundation for a new society.</description> </book> <book id="bk104"> <author>Corets, Eva</author> <title>Oberon\'s Legacy</title> <genre>Fantasy</genre> <price>5.95</price> <publish_date>2001-03-10</publish_date> <description>In post-apocalypse England, the mysterious agent known only as Oberon helps to create a new life for the inhabitants of London. Sequel to Maeve Ascendant.</description> </book> <book id="bk105"> <author>Corets, Eva</author> <title>The Sundered Grail</title> <genre>Fantasy</genre> <price>5.95</price> <publish_date>2001-09-10</publish_date> <description>The two daughters of Maeve, half-sisters, battle one another for control of England. Sequel to Oberon\'s Legacy.</description> </book> <book id="bk106"> <author>Randall, Cynthia</author> <title>Lover Birds</title> <genre>Romance</genre> <price>4.95</price> <publish_date>2000-09-02</publish_date> <description>When Carla meets Paul at an ornithology conference, tempers fly as feathers get ruffled.</description> </book> <book id="bk107"> <author>Thurman, Paula</author> <title>Splish Splash</title> <genre>Romance</genre> <price>4.95</price> <publish_date>2000-11-02</publish_date> <description>A deep sea diver finds true love twenty thousand leagues beneath the sea.</description> </book> <book id="bk108"> <author>Knorr, Stefan</author> <title>Creepy Crawlies</title> <genre>Horror</genre> <price>4.95</price> <publish_date>2000-12-06</publish_date> <description>An anthology of horror stories about roaches, centipedes, scorpions  and other insects.</description> </book> <book id="bk109"> <author>Kress, Peter</author> <title>Paradox Lost</title> <genre>Science Fiction</genre> <price>6.95</price> <publish_date>2000-11-02</publish_date> <description>After an inadvertant trip through a Heisenberg Uncertainty Device, James Salway discovers the problems of being quantum.</description> </book> <book id="bk110"> <author>O\'Brien, Tim</author> <title>Microsoft .NET: The Programming Bible</title> <genre>Computer</genre> <price>36.95</price> <publish_date>2000-12-09</publish_date> <description>Microsoft\'s .NET initiative is explored in detail in this deep programmer\'s reference.</description> </book> <book id="bk111"> <author>O\'Brien, Tim</author> <title>MSXML3: A Comprehensive Guide</title> <genre>Computer</genre> <price>36.95</price> <publish_date>2000-12-01</publish_date> <description>The Microsoft MSXML3 parser is covered in detail, with attention to XML DOM interfaces, XSLT processing, SAX and more.</description> </book> <book id="bk112"> <author>Galos, Mike</author> <title>Visual Studio 7: A Comprehensive Guide</title> <genre>Computer</genre> <price>49.95</price> <publish_date>2001-04-16</publish_date> <description>Microsoft Visual Studio 7 is explored in depth, looking at how Visual Basic, Visual C++, C#, and ASP+ are integrated into a comprehensive development environment.</description> </book> </catalog>';

// Variables
var count = 0;
var servers = 0

// Test hash.
const tests = [
    {name: "HAPI", url: "http://localhost:8000"},
    {name: "EXPRESS", url: "http://localhost:3000"},
    {name: "CONNECT", url: "http://localhost:3031"},
    {name: "RESTIFY", url: "http://localhost:8080"},
];

// Test runners
function test(tests, index){
    let start = new Date().getTime();
    while(count < totalReq){
        count++;
        // console.log("Flick; ", count)
        request(tests[index].url, function(error, response, body){
            if (!error && response.statusCode == 200) {
                count -= 1;
              if(count <= 0){
                  count = 0;
                  let end = new Date().getTime();
                  let time = end - start;
                  console.log(`${tests[index].name} Execution time: ${time}`);
                  index = index + 1;
                  if(index < tests.length)
                    test(tests, index);
              }
            }
        });
    }
}

// Initialise servers
function init(state){
    servers += state;
    if(servers >= tests.length)
        test(tests, 0);
}

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
// EXPRESS
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
const expressApp = express();

expressApp.get('/', function (req, res) {
  res.send(file);
});

expressApp.listen(3000, function () {
    init(1);
});

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
// HAPI
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
        return reply(file);
    }
});

// Start the server
server.start((err) => {
    if(err) throw err;

    init(1);
});

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
// CONNECT
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

var connectApp = connect();

function sayHello(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('file');
}

connectApp
   .use(sayHello)
   .listen(3031, function(){
       init(1);
   });

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
// RESTIFY
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

function respond(req, res, next) {
    res.send(file);
}

var restifyServer = restify.createServer();
restifyServer.get('/', respond);

restifyServer.listen(8080, function() {
   init(1);
});
