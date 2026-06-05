import { Router } from "express";
import dashboardRoute from "./dashboard.route"
import postRoute from "./post.route"
import helperRoute from "./helper.route"

const router = Router();

router.use('/dashboard', dashboardRoute)
router.use('/posts', postRoute)
router.use('/helper', helperRoute)

export default router;