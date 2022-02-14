const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 1 * 1024 * 1024 //* 1024//2MB max file(s) size
    }
}));

//add other middleware
app.use(cors());

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan('dev'));


app.get('/', (req, res) => {
    console.log("ffff");
    res.send("hello world")
})
// upoad single file
app.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.status('404').send({
                status: 404,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            if(avatar.truncated){
                res.status(413).send(`please upload file up to 2MB`);
            }
            //Use the mv() method to place tipconfige file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// upload multiple files
app.post('/upload-photos', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
    
            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];
                
                //move photo to upload directory
                photo.mv('./uploads/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/readfile', async (req, res) => {
    let data
    const filePath = path.resolve('uploads/text.csv')
    try {
        data = await fs.readFile(filePath);
        console.log(data.toString());
      } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
      }

      res.send({
        message: 'Files is uploads/text.csv',
        data: data.toString()
      })
    
});


app.get('/writefile', async (req, res) => {
    let data
    const filePath = path.resolve('uploads/text.csv')
    const content = 'israel dahan'
    try {
        await fs.writeFile(filePath, content);
      } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
      }

      res.send({
        message: 'Files is write uploads/text.csv',
      })
    
});


//make uploads directory static
app.use(express.static('uploads'));

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);
