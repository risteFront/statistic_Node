fs = require('fs')
var path = require('path')
const csv=require('csvtojson')

//const csvFilePath='"C:/Users/riste/Desktop/testReact/reactjs-basics-master/uploads'

function getFileFromDirectory(){
    var homedir = "C:/Users/riste/Desktop/testReact/reactjs-basics-master/uploads"
    var files = fs.readdirSync(homedir);
    
    for(var i in files) {
      if(path.extname(files[i]) === ".csv") {
          //do something
          console.log(files[i])
          fs.readFile('uploads/' + files[0], 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
          // return data
          csv({noheader:true})
          .fromString(data)
          .on('csv',(csvRow)=>{ // this func will be called 3 times 
              console.log(csvRow)
              return csvRow
               // => [1,2,3] , [4,5,6]  , [7,8,9] 
          })
          .on('done',()=>{
              //parsing finished 
          })
          })
      }
    };
}
module.exports = getFileFromDirectory();