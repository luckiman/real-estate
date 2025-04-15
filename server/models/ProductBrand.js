const mongoose = require("mongoose");

const productBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter brand name"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please enter brand description"],
  },
  logo: {
    type: String,
    required: [true, "Please provide a brand logo"],
  },
  slug: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate slug before validation
productBrandSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  }
  next();
});

// Drop the systemName index if it exists
productBrandSchema.on('index', function(err) {
  if (err) {
    console.error('Error creating indexes:', err);
  }
});

module.exports = mongoose.model("ProductBrand", productBrandSchema);
