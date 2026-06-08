import { Router } from "express";
import * as postController from "../../controllers/admin/post.controller";
import multer from "multer";
import * as postValidate from "../../validates/admin/post.validate";

const router = Router();

const upload = multer();

router.get('/post-list', postController.GETpostList)
router.get('/post-create', postController.GETcreatePost)
router.post('/post-create', upload.none(), postValidate.createPost, postController.POSTcreatePost)

router.get('/post-edit/:id', postController.GETeditPost)
router.patch('/post-edit/:id', upload.none(), postValidate.createPost, postController.PATCHeditPost)

router.get('/category-list', postController.GETcategoryList)
router.get('/category-create', postController.GETcreateCategory)
router.post('/category-create', upload.none(), postValidate.createCategory, postController.POSTcreateCategory)

router.get('/category-edit/:id', postController.GETeditCategory)
router.patch('/category-edit/:id', upload.none(), postValidate.createCategory, postController.PATCHeditCategory)
export default router;