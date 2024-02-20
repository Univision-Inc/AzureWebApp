const signalR = require("@microsoft/signalr");
const { Server } = require('@microsoft/signalr');

const serviceEndpoint = "https://testingsignalruni.service.signalr.net";
const accessKey = "Njkgs7ItG7T5OQopfkFfYuDwZL6akd71RKAXakKelA8=";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${serviceEndpoint}/chatHub`, { accessTokenFactory: () => accessKey })
    .build();