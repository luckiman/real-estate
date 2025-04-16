const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const SearchFeatures = require("../utils/searchFeatures");
const ErrorHandler = require("../utils/errorHandler");

// Get All Products
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  const resultPerPage = 12;
  const productsCount = await Product.countDocuments();

  const searchFeature = new SearchFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await searchFeature.query;
  let filteredProductsCount = products.length;

  searchFeature.pagination(resultPerPage);

  products = await searchFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Products ---Product Sliders
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Get All Products ---ADMIN
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  try {
    console.log('Request body:', req.body);

    // Handle product images
    let images = [];
    if (req.body.images) {
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else if (Array.isArray(req.body.images)) {
        images = req.body.images;
      }
    }

    console.log('Images to process:', images);

    const imagesLink = images.map(url => ({
      public_id: url.split('/').pop().split('.')[0], // Generate a simple public_id from the URL
      url: url
    }));

    // Handle brand logo - make it optional
    let brandLogo = null;
    if (req.body.logo) {
      brandLogo = {
        public_id: req.body.logo.split('/').pop().split('.')[0],
        url: req.body.logo
      };
    }

    req.body.brand = {
      name: req.body.brandname || 'Unknown Brand',
      logo: brandLogo,
    };
    req.body.images = imagesLink;

    // Handle specifications
    let specs = [];
    if (req.body.specifications && Array.isArray(req.body.specifications)) {
      req.body.specifications.forEach((s) => {
        if (typeof s === "string") {
          specs.push(JSON.parse(s));
        } else {
          specs.push(s);
        }
      });
    }
    req.body.specifications = specs;

    console.log('Final request body before create:', req.body);

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Detailed error in createProduct:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update Product ---ADMIN
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404));
    }

    // Create a copy of the request body to avoid modifying the original
    const updateData = { ...req.body };

    // Only update images if explicitly provided and not empty
    if (!updateData.images || updateData.images.length === 0) {
      delete updateData.images;
    }

    // Handle brand logo if provided
    if (updateData.logo && typeof updateData.logo === 'string') {
      const brandLogo = {
        public_id: updateData.logo.split('/').pop().split('.')[0],
        url: updateData.logo
      };
      updateData.brand = {
        name: updateData.brandname || product.brand?.name || 'Unknown Brand',
        logo: brandLogo,
      };
    } else if (updateData.brandname) {
      // Update only brand name if no new logo is provided
      updateData.brand = {
        ...product.brand,
        name: updateData.brandname
      };
    } else {
      // Keep existing brand if no updates are provided
      delete updateData.brand;
    }

    // Handle specifications
    if (updateData.specifications && Array.isArray(updateData.specifications)) {
      let specs = [];
      updateData.specifications.forEach((s) => {
        if (typeof s === "string") {
          try {
            specs.push(JSON.parse(s));
          } catch (e) {
            specs.push(s);
          }
        } else {
          specs.push(s);
        }
      });
      updateData.specifications = specs;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// Delete Product ---ADMIN
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  await Product.deleteOne({ _id: req.params.id });

  res.status(201).json({
    success: true,
  });
});

// Create OR Update Reviews
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  product.reviews.push(review);
  product.numOfReviews = product.reviews.length;

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of Product
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Reviews
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings: Number(ratings),
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
