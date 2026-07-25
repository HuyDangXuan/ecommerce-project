import { Router } from "express";
import * as productController from "../../controllers/admin/product.controller";
import { checkPermission } from "../../middlewares/auth.middleware";
import multer from "multer";
import * as productValidate from "../../validates/admin/product.validate";

const router = Router();

const upload = multer();

// PRODUCT
router.get('/product-list', checkPermission('product-list'), productController.GETproductList);
router.get('/product-create', checkPermission('product-create'), productController.GETcreateProduct);
router.post('/product-create', checkPermission('product-create'), upload.none(), productValidate.createProduct, productController.POSTcreateProduct);
router.get('/product-edit/:id', checkPermission('product-edit'), productValidate.createProduct, productController.GETeditProduct);
router.patch('/product-edit/:id', checkPermission('product-edit'), upload.none(), productValidate.createProduct, productController.PATCHeditProduct);
router.patch('/product-delete/:id', checkPermission('product-delete'), productController.PATCHdeleteProduct);

// PRODUCT CATEGORY
router.get('/product-category-list', checkPermission('product-category-list'), productController.GETproductCategoryList);
router.get('/product-category-create', checkPermission('product-category-create'), productController.GETcreateProductCategory);
router.post('/product-category-create', checkPermission('product-category-create'), upload.none(), productValidate.createProductCategory, productController.POSTcreateProductCategory);
router.get('/product-category-edit/:id', checkPermission('product-category-edit'), productValidate.createProductCategory, productController.GETeditProductCategory);
router.patch('/product-category-edit/:id', checkPermission('product-category-edit'), upload.none(), productValidate.createProductCategory, productController.PATCHeditProductCategory);
router.patch('/product-category-delete/:id', checkPermission('product-category-delete'), productController.PATCHdeleteProductCategory);

// PRODUCT ATTRIBUTE
router.get('/product-attribute-list', checkPermission('product-attribute'), productController.GETproductAttributeList);
router.get('/product-attribute-create', checkPermission('product-attribute'), productController.GETcreateProductAttribute);
router.post('/product-attribute-create', checkPermission('product-attribute'), upload.none(), productValidate.createProductAttribute, productController.POSTcreateProductAttribute);
router.get('/product-attribute-edit/:id', checkPermission('product-attribute'), productValidate.createProductAttribute, productController.GETeditProductAttribute);
router.patch('/product-attribute-edit/:id', checkPermission('product-attribute'), upload.none(), productValidate.createProductAttribute, productController.PATCHeditProductAttribute);
router.patch('/product-attribute-delete/:id', checkPermission('product-attribute'), productController.PATCHdeleteProductAttribute);
export default router;