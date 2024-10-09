const { addNewUser, getUser, removeUser } = require("./Usersdata");

const socketconnection = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Handle new user joining
        socket.on("newUser", (username) => {
            addNewUser(username, socket.id);
        });

        // Handle sending notifications
        socket.on("changerole", ({ senderName, receiverName }) => {
            const receiver = getUser(receiverName);
            if (receiver) {
                io.to(receiver.socketId).emit("getNotification", {
                    senderName,
                    type,
                });
            }
        });

        // Handle sending texts
        socket.on("sendText", ({ senderName, receiverName, text }) => {
            const receiver = getUser(receiverName);
            if (receiver) {
                io.to(receiver.socketId).emit("getText", {
                    senderName,
                    text,
                });
            }
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
            removeUser(socket.id);
        });
    });
};

module.exports = socketconnection;
