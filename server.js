import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';
import { createServer } from 'http';
import { Server } from 'socket.io';


// Import connection file 
import connect from './database/conn.js';

const app = express()

// App middlewares 
app.use(cors());
app.use(express.json());
config();


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Application port 
const port = process.env.PORT || 8080;

// Routes 
app.use('/api', router) 

app.get('/', (req, res) => {
  try {
    res.json("Get Request")
  } catch (error) {
    res.json(error)
  }
})

let pairCount = 0, id;

// Socket.io connection
io.sockets.on('connection', function(socket){
  console.log("connection made");
	socket.on('addClient', function(username){
    console.log("added client", username);
    
    pairCount++;
    if(pairCount === 1){
      id = Math.round((Math.random() * 1000000));
      socket.join(id);
      console.log(username, "joined", id);
    } 
    // else if(pairCount < 7){
    //     socket.join(id);
    //     console.log(username, "joined", id);
    // } 
    else if(pairCount === 2){
        socket.join(id);
        console.log(username, "joined", id);
        console.log("players joined", id);

        // Emit 'startQuiz' in all the sockets present in room {id}
        io.sockets.in(id).emit('startQuiz');
    }
  });

	socket.on('disconnect', function(){
    console.log("socket disconnected");
	});
});

// Start server only when Database connected 
connect().then(() => {
  try {
    httpServer.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`)
    })
  } catch (error) {
    console.log("Cannot connect to the server");
  }
}).catch(error => {
  console.log("Invalid Database Connection");
})

