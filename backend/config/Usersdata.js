let onlineUsers = [];

const addNewUser = (username, socketId) => {
    if (!onlineUsers.some((user) => user.username === username)) {
        onlineUsers.push({ username, socketId });
    }
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
};

const getOnlineUsers = () => {
    return onlineUsers;
};

module.exports = {
    addNewUser,
    removeUser,
    getUser,
    getOnlineUsers,
};
