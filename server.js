const http = require('http');
const express = require('express');
const { Server } = require('@microsoft/signalr');

const app = express();
app.use(cors({
    origin: '*'
  }));
const server = http.createServer(app);

// Create a SignalR server
const signalR = new Server({
  path: '/signalr',
});

// Define a hub and its methods
signalR.hub('chatHub', {
  async sendMessage(user, message) {
    await this.clients.all.invoke('receiveMessage', user, message);
  },
});

// Use SignalR middleware
app.use(signalR);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});