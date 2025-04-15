const mongoose = require("mongoose");
const URLSlugs = require("mongoose-url-slugs");
const Schema = mongoose.Schema;

//category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter category name"],
    trim: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: [true, "Please enter display name"],
  },
  systemName: {
    type: String,
    required: [true, "Please enter system name"],
  },
  description: {
    type: String,
    required: [true, "Please enter category description"],
  },
  image: {
    type: String,
    required: [true, "Please provide a category image"],
  },
  slug: {
    type: String,
    unique: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "productbrand",
  },
  brands: [
    {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
  ],
  isDisabled: {
    type: Date,
    default: null,
  },
});

// Generate slug before validation
categorySchema.pre('validate', function(next) {
  if (this.systemName) {
    this.slug = this.systemName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
