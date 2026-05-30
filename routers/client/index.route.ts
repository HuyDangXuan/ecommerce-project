import { Router } from "express";
import homeRoute from "./home.route"

const router = Router();

router.use('/', homeRoute)

export default router;