let csvToJson = require('convert-csv-to-json');
const fs = require('fs');
let fileInputName = process.argv[2];
let fileOutputName = process.argv[3];

const csvFilePath=fileInputName;
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    fs.writeFile(fileOutputName, JSON.stringify(jsonObj), err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
    console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */
})

