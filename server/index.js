import express from 'express'

import cors from 'cors'

const app = express()
ddd

// Middleware
app.use(express.json())

Port=process.env.PORT || 500

app.listen(3000, () => {console.log(`Server is running on port ${Port}`)})