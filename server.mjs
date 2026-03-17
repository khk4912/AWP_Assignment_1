// @ts-check

import express from 'express'

const app = express()
const PORT = process.env.PORT || 3500

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Name: Ha Gyun Kim')
})
