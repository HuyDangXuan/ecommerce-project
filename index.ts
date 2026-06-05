import express from 'express'
import path from 'path'
import { pathAdmin } from './config/variable.config'
import connectDB from './config/database.config'
import dotenv from 'dotenv'

dotenv.config();

import adminRouter from './routers/admin/index.route'
import clientRouter from './routers/client/index.route'

const app = express()
const port = 3000

connectDB();

const viewsPath = path.join(__dirname, 'views')
const publicPath = path.join(__dirname, 'public')

// Thiết lập biến toàn cục
app.locals.pathAdmin = pathAdmin

app.set('views', viewsPath)
app.set('view engine', 'pug')

// Cho phép gửi dữ liệu lên dưới dạng JSON
app.use(express.json())

app.use(express.static(publicPath))

app.use(`/${pathAdmin}`, adminRouter)

app.use('/', clientRouter)

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`)
})
