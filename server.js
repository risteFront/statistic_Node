var express = require("express")
var multer = require('multer')
var app = express()
var path = require('path')
var fs = require('fs')
const csv=require('csvtojson')
var convertedFile = require('./api/csv_file_dir')

console.log(convertedFile)
var ejs = require('ejs')
app.set('view engine', 'ejs')

app.use(express.static('client'))
app.set('views', path.join(__dirname, 'client/views'));


app.get('/', function (req, res) {
  res.render('index')
})

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

app.post('/', function (req, res) {

  var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
      console.log(file)
      var ext = path.extname(file.originalname)
      if (ext !== '.csv') {
        return callback(res.end('Only CSV file is allowed!!'), null)
      }
      callback(null, true)
    }
  }).single('userFile');
  upload(req, res, function (err) {
    res.end('File is uploaded')
  })
})

var port = process.env.PORT || 8000
app.listen(port, function () {
  console.log('Node.js listening on port ' + port)
})
