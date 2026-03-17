// @ts-check

import express from 'express'

import EventEmitter from 'events'
import { logEvents } from './logEvents.js'

class Emitter extends EventEmitter {}

const PORT = process.env.PORT || 3500

const myEmitter = new Emitter()
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))

console.log('Name: Ha Gyun Kim')

const app = express()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.addListener('log', (msg, fileName) => logEvents(msg, fileName))
