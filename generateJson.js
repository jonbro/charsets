// creates a json representation of a file in the data directory
var fs = require('fs');
var loader = require('./index');


if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " data_root_name");
    process.exit(-1);
}
 
var param = process.argv[2];
var filename = param+".json";
fs.writeFile("./"+filename, JSON.stringify(loader.getSet(param)), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("output to: " + filename);
}); 