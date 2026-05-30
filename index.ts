import express from 'express'
import path from 'path'

import adminRouter from './routers/admin/index.route'
import clientRouter from './routers/client/index.route'

const app = express()
const port = 3000
const viewsPath = path.join(__dirname, 'views')
const publicPath = path.join(__dirname, 'public')

app.set('views', viewsPath)
app.set('view engine', 'pug')

app.use(express.static(publicPath))

app.use('/admin', adminRouter)

app.use('/', clientRouter)

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`)
})
