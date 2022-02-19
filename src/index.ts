import express from 'express'
import {Server} from 'http'
import {initializeSocketIo} from "./sockets"
import cors from 'cors'

const app = express()
const port = 5000
const http = new Server(app)

app.use(cors({ origin: "*" }))

app.get('/', (req, res) => {
    res.json({
        status: 'sucess'
    })
})
initializeSocketIo(http)

http.listen(port, () =>
    console.log(`Listening at http://localhost:${port}/`)
)