// -----------------------------
// developed by Nagharaco
// Naghshara Cunsolting Company
// Nodejs Website -> Managing published services
//------------------------------


const express = require('express');
const cors = require('cors');
const path = require('path');

const createFile = require('./public/js/functions').createFile;

const serviceManager = require('./routes/service-manager-route');

const app = express();
const port = process.env.PORT || 8008;

app.use(cors());

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use(express.json());
app.use('/', serviceManager);
app.use((req, res) => {
  res.status(404).send('Page not found!');
})

app.listen(port, () => {
  
  console.log(`Server Running on port ${port}.`);

  createFile('serviceLock.txt')
    .then(message => console.log(message))
    .catch(message => console.log(message))

  createFile('serviceTime.txt')
    .then(message => console.log(message))
    .catch(message => console.log(message))

})