const express = require('express');
const http = require('http');
const signalR = require('@microsoft/signalr');

const app = express();
const server = http.createServer(app);

const signalRServiceEndpoint = "https://testingsignalruni.service.signalr.net";
const signalRServiceAccessKey = "Njkgs7ItG7T5OQopfkFfYuDwZL6akd71RKAXakKelA8=";

const signalRServer = new signalR.Server({
  path: '/signalr',
  server: server,
  // The following line configures the SignalR service endpoint and access key
  accessTokenFactory: () => signalRServiceAccessKey,
});

// Define your SignalR hub
signalRServer.hub('chatHub', {
  async sendMessage(user, message) {
    await this.clients.all.invoke('receiveMessage', user, message);
  },
});

// Use SignalR middleware
app.use('/signalr', signalRServer);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
