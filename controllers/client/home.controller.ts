import { Request, Response } from 'express'

export const home = (req: Request, res: Response) => {
  res.render('client/pages/home', {
    title: 'Trang chủ',
  })
}