const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', "ejs");
app.use(express.static(path.join(__dirname, "public")));
const users = {};
io.on('connection', (socket) => {
    console.log("connected");
    socket.on("send-location", (data) => {
        const user = {
            id: socket.id,
            username: data.username,
            lat: data.lat,
            long: data.long
        };

        users[socket.id] = user;
        io.emit("receive-location", { id: socket.id, ...data });
        
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id} is disconnected`);
        delete users[socket.id];
        io.emit('user-disconnected', socket.id);
    })
})


app.get('/', (req, res) => {
    res.render('index');
})


const PORT = 4002;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})


