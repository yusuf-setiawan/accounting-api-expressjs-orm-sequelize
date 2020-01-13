'use strict';
var dotenv = require('dotenv');

exports.ok = function(values, res) {
    var data = {
        'status': 200,
        'values': values
    };
    res.json(data);
    res.end();
};

exports.badrequest = function(values, res) {
    var data = {
        'status': 400,
        'values': values
    };
    res.json(data);
    res.end();
};

exports.error = function(values, res) {
    var data = {
        'status': 501,
        'values': values
    };
    res.json(data);
    res.end();
};

exports.isAuthorized = function(req, res) {

    var API_KEY = 'secret';
    // check header or url parameters or post parameters for token
    var CLIENT_APP_KEY = req.header('API-KEY')
    console.log('CLIENT_APP_KEY = ', CLIENT_APP_KEY);

    const env = dotenv.config()
    console.log('env = ', env);
    if (env.error) {
        throw env.error
    }

    var SERVER_APP_KEY = env.parsed['API-KEY'];
    console.log('SERVER_APP_KEY = ', SERVER_APP_KEY);

    if (SERVER_APP_KEY != CLIENT_APP_KEY) {
        //console.log('not authorized');
        this.notAuthorized(res)
        return false;
    } else {
        console.log('authorized');
        return true;
    }

};

exports.notAuthorized = function(res) {
    res.status(401).send('not authorized')
    res.end();
};