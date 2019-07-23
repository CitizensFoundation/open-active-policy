let csvToJson = require('convert-csv-to-json');
 
let fileInputName = process.argv[2]; 
let fileOutputName = process.argv[3];
 
const csvFilePath=fileInputName;
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */ 
})

