import { Router } from "express";
import dashboardRoute from "./dashboard.route"
import postRoute from "./post.route"
import helperRoute from "./helper.route"
import fileManagerRoute from "./file-manager.route";
import roleRoute from "./role.route";
import accountRoute from "./account.route";
import authRoute from "./auth.route";

import { verifyTokenAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.use('/dashboard', verifyTokenAdmin, dashboardRoute)
router.use('/posts', verifyTokenAdmin, postRoute)
router.use('/helper', verifyTokenAdmin, helperRoute)
router.use('/file-manager', verifyTokenAdmin, fileManagerRoute)
router.use('/roles', verifyTokenAdmin, roleRoute)
router.use('/accounts', verifyTokenAdmin, accountRoute)
router.use('/auth', authRoute)

export default router;