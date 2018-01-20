const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 })

wss.broadcast = data => wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
        client.send(data)
    }
})

wss.on('connection', function connection(ws) {
    console.log('connection')
    ws.on('open', () => console.log('open'))
    ws.on('close', () => console.log('close'))
    ws.on('error', error => console.log('error', ws.client, error.message))

    ws.on('message', wss.broadcast)
});
