require('dotenv').config();
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validations');
require('./startup/redis');
require('./startup/cors')(app);

app.listen(3400, () => console.log(`Listening on port ${3400}...`));