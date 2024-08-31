// import the express
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import ejs from 'ejs';
// to convert your file path to url
import { fileURLToPath } from 'url';


//find the exact directory of your project
import { dirname } from 'path';
import path from 'path';

// convert the filename to the url
const filename = fileURLToPath(import.meta.url);
// here extract the directory name 
const __dirname = path.dirname(filename);
const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

io.on('connection',(socket)=>{
    // make a connection on socket
    console.log('a new user is connected',socket.id);

    //receive a event from the frontend in which we got the lanitude or latitude
    socket.on("send-location",(data)=>{
        //now emit to all user that are connected to that server
        io.emit("receive-location",{id:socket.id,...data})
    })
    // now when the user closed the server remove it
    socket.on("disconnect",()=>{
        io.emit("user-disconnected",socket.id);
    })
})


app.use(express.static("public"));//  this is use to get the static files from public folder directly
// set the engine to ejs no need to use the extension of ejs
app.set("view engine", "ejs");
// now whenever i access the static files then it automatically join the file url before it
app.set(express.static(path.join(__dirname,)))
// here i simply render the index.ejs file
app.get('/',(req,res)=>{
    res.render('./index');
})

server.listen(port,()=>{
    console.log(`listening on ${port}`);
})