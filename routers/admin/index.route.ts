import { Router } from "express";
import dashboardRoute from "./dashboard.route"
import postRoute from "./post.route"
import helperRoute from "./helper.route"
import fileManagerRoute from "./file-manager.route";
import roleRoute from "./role.route";
import accountRoute from "./account.route";
import authRoute from "./auth.route";
import productRoute from "./product.route";

import { verifyTokenAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.use('/dashboard', verifyTokenAdmin, dashboardRoute)
router.use('/posts', verifyTokenAdmin, postRoute)
router.use('/helper', verifyTokenAdmin, helperRoute)
router.use('/file-manager', verifyTokenAdmin, fileManagerRoute)
router.use('/roles', verifyTokenAdmin, roleRoute)
router.use('/accounts', verifyTokenAdmin, accountRoute)
router.use('/products', verifyTokenAdmin, productRoute)
router.use('/auth', authRoute)

// router.use('/dashboard', dashboardRoute)
// router.use('/posts', postRoute)
// router.use('/helper', helperRoute)
// router.use('/file-manager', fileManagerRoute)
// router.use('/roles', roleRoute)
// router.use('/accounts', accountRoute)
// router.use('/auth', authRoute)

export default router;