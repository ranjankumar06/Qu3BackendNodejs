const express = require('express');
const { config } = require('dotenv');
const dbConnect = require('./dbConnect.js');
const authRoutes = require('./routes/auth.js');
const adminRouter = require("./routes/adminRouter")
const blockRouter = require("./routes/blockRouter")
const commentReply = require("./routes/commentReplyRouter.js")
const followRouter = require("./routes/followRouter.js")
const likecomment = require("./routes/likeCommentRouter.js")
// const postRouter = require("./routes/postRouter.js")
const reportRouter=require("./routes/reportRouter.js")
const likeRouter=require("./routes/likeRouter.js")
//Loads the handlebars module
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const http = require('http')
const socketio = require('socket.io')
const socketServer = require('./socketServer.js');
const app = express();
const cors = require('cors');
const path = require("path")
app.use(cors());
const serve = require('express-static');

const server = http.createServer(app)
const io = socketio(server)

// Socket start
io.on('connection', (socket, data) => {
    console.log("connectoipn", socket.id);

    socket.on('newuserconnected', () => {
        console.log("newuserconnected", socket.id);

        socket.emit('newuserconnected', { message: socket.id });
    })
    socket.on('message', (data) => {
        socketServer.initializeSocket(io, socket, data)

        console.log("message2", data);

        // socket.emit('message', { message: socket.id });

    })

    socket.on('disconnect', function () {
        console.log("disconnect", socket.id);
        socket.emit('userDisconnected', { message: socket.id });

    });
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use("/public", express.static("public"))
// app.set('views', path.join(_dirname,"./"))
app.set("view engine", "hbs")


const hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: 'views/index',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

config();
dbConnect();

app.use(express.json());
app.use('/file/path', serve(path.join(__dirname, '../uploads')))
app.set("view engine", "hbs");
app.use("/api", authRoutes);
app.use("/admin", adminRouter)
app.use("/block", blockRouter)
app.use("/comment", commentReply)
app.use("/follow", followRouter)
app.use("/like", likecomment)
// app.use("/post", postRouter)
app.use("/report",reportRouter)
app.use("/like",likeRouter)
// app.use(errorHandler);

// const port = process.env.PORT || 3008;
server.listen(process.env.PORT || 3004)
// app.listen(port, () => console.log(`Listening on port ${port}...`));