// @ts-check

import express from 'express'
import path from 'path'

import { fileURLToPath } from 'url'
import studentRouter from './routes/student_router.js'


const app = express()
const PORT = process.env.PORT || 3500
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/students', studentRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Name: Ha Gyun Kim')
})
