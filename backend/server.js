const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rendre io accessible dans les routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`Client ${userId} a rejoint son canal personnel`);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);

app.get('/', (req, res) => {
  res.send('AutoBrillance API with WebSockets is running');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
