import { Router } from "express";
import dashboardRoute from "./dashboard.route"
import postRoute from "./post.route"
import helperRoute from "./helper.route"
import fileManagerRoute from "./file-manager.route";
import roleRoute from "./role.route";
import accountRoute from "./account.route";
import authRoute from "./auth.route";

const router = Router();

router.use('/dashboard', dashboardRoute)
router.use('/posts', postRoute)
router.use('/helper', helperRoute)
router.use('/file-manager', fileManagerRoute)
router.use('/roles', roleRoute)
router.use('/accounts', accountRoute)
router.use('/auth', authRoute)

export default router;