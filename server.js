const bodyParser = require('body-parser')
const cors = require('cors')
const express= require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('.'))

wss.broadcast = data => wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
        client.send(data)
    }
})

app.post('/broadcast', (req, res) => {
    wss.broadcast(JSON.stringify(req.body))
    res.sendStatus(200)
})

wss.on('connection', function connection(ws) {
    console.log('connection')
    ws.on('open', () => console.log('open'))
    ws.on('close', () => console.log('close'))
    ws.on('error', error => console.log('error', ws.client, error.message))

    ws.on('message', wss.broadcast)
})

server.listen(process.env.PORT || 8080)