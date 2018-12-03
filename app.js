var express = require('express');

var app = express();

var sitePath = process.argv[2] || ".";

app.use(express.static(__dirname + '/' + sitePath));

var PORT = process.env.PORT || 1337;

app.listen(PORT, function(){
    console.log('Server is up and running!');
});