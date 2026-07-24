import { Router } from "express";
import * as productController from "../../controllers/admin/product.controller";
import { checkPermission } from "../../middlewares/auth.middleware";
import multer from "multer";
import * as productValidate from "../../validates/admin/product.validate";

const router = Router();

const upload = multer();

router.get('/product-list', checkPermission('product-list'), productController.GETproductList);

router.get('/product-create', checkPermission('product-create'), productValidate.createProduct, productController.GETcreateProduct);
router.post('/product-create', checkPermission('product-create'), upload.none(), productController.POSTcreateProduct);

router.get('/product-edit/:id', checkPermission('product-edit'), productValidate.createProduct, productController.GETeditProduct);
router.patch('/product-edit/:id', checkPermission('product-edit'), upload.none(), productController.PATCHeditProduct);

router.patch('/product-delete/:id', checkPermission('product-delete'), productController.PATCHdeleteProduct);


router.get('/product-category-list', checkPermission('product-category-list'), productController.GETproductCategoryList);

router.get('/product-category-create', checkPermission('product-category-create'), productValidate.createProductCategory, productController.GETcreateProductCategory);
router.post('/product-category-create', checkPermission('product-category-create'), upload.none(), productController.POSTcreateProductCategory);

router.get('/product-category-edit/:id', checkPermission('product-category-edit'), productValidate.createProductCategory, productController.GETeditProductCategory);
router.patch('/product-category-edit/:id', checkPermission('product-category-edit'), upload.none(), productController.PATCHeditProductCategory);

router.patch('/product-category-delete/:id', checkPermission('product-category-delete'), productController.PATCHdeleteProductCategory);


router.get('/product-attribute-list', checkPermission('product-attribute'), productController.GETproductAttributeList);

router.get('/product-attribute-create', checkPermission('product-attribute'), productValidate.createProductAttribute, productController.GETcreateProductAttribute);
router.post('/product-attribute-create', checkPermission('product-attribute'), upload.none(), productController.POSTcreateProductAttribute);

router.get('/product-attribute-edit/:id', checkPermission('product-attribute'), productValidate.createProductAttribute, productController.GETeditProductAttribute);
router.patch('/product-attribute-edit/:id', checkPermission('product-attribute'), upload.none(), productController.PATCHeditProductAttribute);

router.patch('/product-attribute-delete/:id', checkPermission('product-attribute'), productController.PATCHdeleteProductAttribute);
export default router;