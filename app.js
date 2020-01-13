var createError = require('http-errors');
const express = require('express');

const logger = require('morgan');
const bodyParser = require('body-parser');

var respond = require('./res')

//Models
var models = require("./models");
//Sync Database
models.sequelize.sync().then(function() {
    console.log('Database work fines');
}).catch(function(err) {
    console.log('something wrong with Database update');
})

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'

// This will be our application entry. We'll setup our server here.
const http = require('http');
// Set up the express app
const app = express();
// Log requests to the console.
app.use(logger('dev'));
// Parse incoming requests data 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public/'))
app.use((req, res, next) => {
    if (respond.isAuthorized(req, res))
        next();
});
// Setup a default catch-all route that sends back a welcome message in JSON format.
//require our toutes into the application
require('./routes')(app)

app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
}));
const port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port);
module.exports = app;