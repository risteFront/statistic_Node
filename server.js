var express = require ("express");
var multer = require("multer");
var app = express();
var path = require("path");
var fs = require("fs");
var bodyParser = require("body-parser");
var csvjson = require("csvjson");

var ejs = require("ejs");


app.set("view engine", "ejs");
app.use(bodyParser.json());

app.use(express.static("client"));
app.set("views", path.join(__dirname,  "/client/views"));

app.use(function(req, res, next) { 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.static(__dirname + "/client/css"));

var convertedFile = require("./api/csv_file_dir");



app.get("/", function(req, res) {
	res.render("index",{title:"inser a csv format"});
});

app.post("/", function(req, res ,next) {
	var storage = multer.diskStorage({
		destination: function(req, file, callback) {
			callback(null, "./uploads");
		},
		filename: function(req, file, callback) {
			callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
		}
	});
	
	var upload = multer({
		storage: storage,
		fileFilter: function(req, file, callback) {
			var ext = path.extname(file.originalname);
			if (ext !== ".csv") {
				res.render("index",{title:"Only CSV file is allowed"});
			}
			callback(null, true);
		}
	}).single("userFile");
	upload(req, res, function(err) {
		res.render("index",{title:"File is uploaded"});
	});
});

//app.post('/upload')
app.post("/uploads",function(req,res,next){
	var homedir = path.join(__dirname + "/uploads");
	var files = fs.readdirSync(homedir);
	console.log(files)
	if(files.length == 0){
	next()
	}else{
		var data = fs.readFileSync(path.join("uploads/" +  files[files.length-1]), { encoding : "utf8"});
		
		console.log('here')
	var options = {
		delimiter : ",", // optional
		quote     : "\"" // optional
	};

	// res.json(data)
	csvjson.toObject(data, options);
	res.json(csvjson.toObject(data, options));
	}
	
});




var port = process.env.PORT || 8000;
app.listen(port, function () {
	console.log("Node.js listening on port " + port);
});
