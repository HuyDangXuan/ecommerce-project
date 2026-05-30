import express, {Request, Response} from 'express'
import path from 'path'

const app = express()
const port = 3000
const viewsPath = path.join(__dirname, 'views')
const publicPath = path.join(__dirname, 'public')

app.set('views', viewsPath)
app.set('view engine', 'pug')

app.use(express.static(publicPath))

app.get('/', (req: Request, res: Response) => {
  res.render('client/pages/home')
})

app.get('/admin/dashboard', (req: Request, res: Response) => {
  res.render('admin/pages/dashboard', {
    title: 'Trang tổng quan',
  })
})

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`)
})
