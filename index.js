const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging');
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);
require('./startup/redis');
require('./startup/cors')(app);
 

// // const p=Promise.reject(new Error('something failed miserably!...'));
// // p.then(()=>console.log('Done'));
//const port = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Listening on port ${5000}...`));