import { Router } from "express";
import * as postController from "../../controllers/admin/post.controller";
import multer from "multer";
import * as postValidate from "../../validates/admin/post.validate";

const router = Router();

const upload = multer();

router.get('/', postController.posts)

router.get('/create', postController.create)
router.post('/create', upload.none(), postValidate.createPost, postController.createPost)

router.get('/categories', postController.categories)



export default router;