require('dotenv').config();
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();

require('./startup/validations');

require('./startup/redis');
require('./startup/cors')(app);
 

// // const p=Promise.reject(new Error('something failed miserably!...'));
// // p.then(()=>console.log('Done'));
const port = process.env.PORT||5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));