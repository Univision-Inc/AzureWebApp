$(window).on('load', async function(){
    console.log("Window loaded")

    //signalR stuff
    signalR.LogLevel = signalR.LogLevel.Debug;
    signalR.HubConnectionBuilder.logging = signalR.LogLevel.Debug;
    //builder.Services.AddCors(x => x.AddPolicy("AllowAll", p =>{ p.SetIsOriginAllowed( _ =>true).AllowAnyHeader().AllowAnyMethod().AllowCredentials(); }));
    
    let apiBaseUrl
     if(location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        console.log("Running locally!")
        apiBaseUrl = 'http://localhost:7071'
    }else {
        console.log("Running online!")
        apiBaseUrl = window.location.origin
    }
 
    const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${apiBaseUrl}/signalr/chatHub`)
    .configureLogging(signalR.LogLevel.Information)
    .build();

    async function start(){
        try {
            await connection.start()
            .then(() => console.log('Connected to SignalR Service'))
            .then(() => console.log(connection.connection.connectionId))
            .then(() => console.log(connection.baseUrl))
            .catch((err) => console.error('Error connecting to SignalR Service:', err));
        } catch {
            console.log(err)
        }
    }

    await start()

    connection.on('ReceiveMessage', (user,message) => {
        // Handle the incoming message from Teams
        console.log('New message from Teams:', message);
        handleTeams(message)
    });
});


//vars
let convoID = crypto.randomUUID()

function openChat() {
    $('.container').css({"display": "block"})
}

function hideChat() {
    $('.container').css({"display": "none"})
}

function test() {
    console.log("click!")
}
function testClick () {
    console.log("click!")
}

async function sendMessage() {
    let msg = $('#TABody').val()
    //console.log(`Message: ${msg}`)
    await triggerAzureSendMessage(msg)
    //await PostToFlow(msg,convoID)
    $('.msg-inbox').append(`<div class="outgoing-chat"><p>${msg}</p></div>`)
    $('#TABody').val('')
}

function PostToFlow(msg,convoID) {
    let data = {
        message: msg,
        convoID: convoID
    }
    $.ajax({
        url: "https://prod-39.westus.logic.azure.com:443/workflows/5dbbe8092e6d4b9ba4ce47036190574d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3rqJdgkFz04p-GrssEQH2nqNbLxy0sAr5ybBZ4T1zuU",
        type: "POST",
        contentType: "application/json",
        dataType: 'json',
        processData: false,
        data: JSON.stringify(data)
    })
}

//autosize TextArea
function AutoSizer(el){
    el.style.height = 'auto'
    el.style.height = (el.scrollHeight) + 'px'
    //console.log(el.style.height)
}

function triggerAzureSendMessage(msg) {
    console.log(`sending message: ${msg}`)
    let data = {
        message: msg
    }
    $.ajax({
        url: '/api/sendMessage',
        type: 'POST',
        contentType: 'application/json',
        processData:false,
        data: JSON.stringify(data)
    })
}

function handleTeams(data) {
    console.log(`data received: ${data}`)
    $('.msg-inbox').append(`<div class="received-chat"><p>${data}</p></div>`)
}

function testSend (connectionId) {
    connection.invoke("ReceiveMessage", connectionId, "This is a test message")
}