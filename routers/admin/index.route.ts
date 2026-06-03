import { Router } from "express";
import dashboardRoute from "./dashboard.route"
import postRoute from "./post.route"

const router = Router();

router.use('/dashboard', dashboardRoute)
router.use('/posts', postRoute)

export default router;