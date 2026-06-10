import { Router } from "express";
import dashboardRoute from "./dashboard.route"
import postRoute from "./post.route"
import helperRoute from "./helper.route"
import fileManagerRoute from "./file-manager.route";

const router = Router();

router.use('/dashboard', dashboardRoute)
router.use('/posts', postRoute)
router.use('/helper', helperRoute)
router.use('/file-manager', fileManagerRoute)

export default router;