const express = require('express');
const routes = require('./router/router.js');

const app = express();

app.use(routes);

app.listen(8082, () => {
    console.log('Started at 8081');
});
