var meow = require('meow');
var fooApp = require('./lib');
 
var cli = meow({
    help: [
        'Usage',
        '  funfs <input>'
    ]
});
