const express = require('express');
const cors = require('cors');
require('./config/db');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/user.route');
const csvRouter = require('./routes/csv.route');
const notificationRouter = require('./routes/notification.route');
const circularRouter = require('./routes/circular.route');
const contactRouter = require('./routes/contact.route');
const payoutdataRouter = require('./routes/payoutdata.route');
const fileUpload = require('express-fileupload');
const { cloudnairyconnect } = require("./config/cloudinary");
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./config/passport');
const passportRoutes = require('./routes/googleauth/auth.route');
const socketconnection = require('./config/Socket');
const { initializeSocket } = require("./config/socketconnet");
const { checkAndUpdateData } = require('./config/newssave');
const payoutBatches = require('./routes/payoutBatches.route');
const { error } = require('console');
const { authenticateToken } = require('./middleware/auth.middleware');
const bodyParser = require('body-parser');
const folderRouter = require('./routes/folder.route');
const settingsRouter = require('./routes/settings.route');
// const redis = require('./redis/redis')





const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = initializeSocket(server);

// redis.connectRedis();


// app.use(isExcelFile);
// console.log("isExcelFile", isExcelFile);

app.use((req, res, next) => {
  if (!req.isExcelFile) {
    fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
    })(req, res, next);
  } else {
    next();
  }
});

// app.use((req, res, next) => {
//   req.redisClient = redis.getClient();
//   next();
// });


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '50mb' }));
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: '/tmp/',
// }));
app.use(cookieSession({
  name: 'session',
  keys: ['Treyst'],
  maxAge: 24 * 60 * 60 * 1000,
}));
app.use(passport.initialize());
app.use(passport.session());

cloudnairyconnect();

// Initialize Socket.IO connection
socketconnection(io);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/csv', csvRouter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/circulars', circularRouter);
app.use('/auth', passportRoutes);
app.use('/api/v1/sendmessage', contactRouter);
app.use('/api/v1/payoutbatches', payoutBatches);
app.use('/api/v1/payoutdata', payoutdataRouter);
app.use('/api/v1/folder', folderRouter);
app.use('/api/v1/settings', settingsRouter);


app.get('/api/news', authenticateToken, async (req, res) => {
  const data = await checkAndUpdateData();
  if (data) {
    res.status(200).json({ message: "Getting news data", data });
  } else {
    console.log(error)
    res.status(400).json({ error: "Error getting news data" });
  }
});


// app.get('/example', async (req, res) => {
//   try {
//     await req.redisClient.set('exampleKey', 'This is stored in Redis');
//     const value = await req.redisClient.get('exampleKey');
//     res.json({ value });
//   } catch (error) {
//     res.status(500).json({ error: 'Redis operation failed' });
//   }
// });

// process.on('SIGINT', async () => {
//   const client = redis.getClient();
//   await client.quit();
//   process.exit(0);
// });

server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});



module.exports = io;
