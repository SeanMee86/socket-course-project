const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, '/public')));
const socketio = require('socket.io');
const expressServer = app.listen(9000, console.log('server is listening on port 9000'));
const io = socketio(expressServer);
const helmet = require('helmet');
app.use(helmet());
// App Organization
module.exports = {
    app,
    io
};