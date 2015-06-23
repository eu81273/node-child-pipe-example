var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var myFile = fs.createWriteStream('myOutput.txt');

var phantom = spawn('phantomjs', [path.join(__dirname, 'phantomjs-script.js')]);

//화면으로도 뿌리고,
phantom.stdout.pipe(process.stdout, { end: false });

//파일로도 뿌리고,
//phantom.stdout.pipe(myFile);

phantom.on('exit', function (code) {
	process.exit(code);
});
