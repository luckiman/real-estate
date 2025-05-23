const express = require("express");

const {
    getAllProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
    getProductReviews,
    deleteReview,
    createProductReview,
    createProduct,
    getAdminProducts,
    getProducts,
} = require("../controllers/productController");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/all").get(getProducts);

router.route("/admin/products").get(getAdminProducts);
router.route("/admin/product/new").post(createProduct);

router
    .route("/admin/product/:id")
    .put(updateProduct)
    .delete(deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(createProductReview);

router
    .route("/admin/reviews")
    .get(getProductReviews)
    .delete(deleteReview);

module.exports = router;
