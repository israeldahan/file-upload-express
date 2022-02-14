const fs = require('fs').promises;
const path = require('path');


const filePath = path.resolve('uploads/text.csv')
let content = 'israel '
let text
 for (let index = 0; index < 10000; index++) {
     text  +=  `\n ${content} ${index}` 
 }

 fs.writeFile(filePath, text, {'flag': 'a'});