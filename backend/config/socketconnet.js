const socketIo = require('socket.io');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            // origin: "http://localhost:3000",
            origin: "*",

        },
    });

    return io;
}

module.exports = {
    initializeSocket,
    getIo: () => io
};