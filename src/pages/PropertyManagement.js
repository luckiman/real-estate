import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    highlights: [],
    specifications: [],
    price: '',
    cuttedPrice: '',
    images: [],
    brand: {
      name: '',
      logo: {
        public_id: '',
        url: ''
      }
    },
    category: '',
    stock: 1,
    warranty: 1,
    ratings: 0,
    numOfReviews: 0,
    reviews: []
  });
  const [editingId, setEditingId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Set up axios defaults
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:4000';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/products');
      if (response.data && response.data.success) {
        setProperties(response.data.products);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const uploadImages = async () => {
    try {
      setUploadingImages(true);
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axios.post('/api/v1/admin/product/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        return response.data.images;
      }
      throw new Error('Failed to upload images');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedFormData = { ...formData };

      // Upload images first if there are any
      if (imageFiles.length > 0) {
        const uploadedImages = await uploadImages();
        if (uploadedImages.length > 0) {
          updatedFormData = {
            ...updatedFormData,
            images: [...updatedFormData.images, ...uploadedImages]
          };
        }
      }

      if (editingId) {
        const response = await axios.put(`/api/v1/admin/product/${editingId}`, updatedFormData);
        if (response.data.success) {
          toast.success('Property updated successfully');
          setEditingId(null);
          setFormData({
            name: '',
            description: '',
            highlights: [],
            specifications: [],
            price: '',
            cuttedPrice: '',
            images: [],
            brand: {
              name: '',
              logo: {
                public_id: '',
                url: ''
              }
            },
            category: '',
            stock: 1,
            warranty: 1,
            ratings: 0,
            numOfReviews: 0,
            reviews: []
          });
          setImageFiles([]);
          await fetchProperties();
        } else {
          throw new Error(response.data.message || 'Failed to update property');
        }
      } else {
        const response = await axios.post('/api/v1/admin/product/new', updatedFormData);
        if (response.data.success) {
          toast.success('Property created successfully');
          setFormData({
            name: '',
            description: '',
            highlights: [],
            specifications: [],
            price: '',
            cuttedPrice: '',
            images: [],
            brand: {
              name: '',
              logo: {
                public_id: '',
                url: ''
              }
            },
            category: '',
            stock: 1,
            warranty: 1,
            ratings: 0,
            numOfReviews: 0,
            reviews: []
          });
          setImageFiles([]);
          await fetchProperties();
        } else {
          throw new Error(response.data.message || 'Failed to create property');
        }
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(error.response?.data?.message || error.message || 'Error saving property');
    }
  };

  const handleEdit = (property) => {
    setEditingId(property._id);
    setFormData(property);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`/api/v1/admin/product/${id}`);
        toast.success('Property deleted successfully');
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error(error.response?.data?.message || 'Error deleting property');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Property Management</h1>

      {/* Property Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-white border-b border-gray-700 pb-4">
          {editingId ? 'Edit Property' : 'Add New Property'}
        </h2>
        
        <table className="w-full">
          <tbody className="space-y-4">
            <tr>
              <td className="pr-4 py-4 w-1/6">
                <label className="block text-sm font-medium text-white">Name</label>
              </td>
              <td className="py-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="pr-4 py-4">
                <label className="block text-sm font-medium text-white">Category</label>
              </td>
              <td className="py-4">
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="pr-4 py-4">
                <label className="block text-sm font-medium text-white">Price</label>
              </td>
              <td className="py-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="pr-4 py-4">
                <label className="block text-sm font-medium text-white">Cutted Price</label>
              </td>
              <td className="py-4">
                <input
                  type="number"
                  name="cuttedPrice"
                  value={formData.cuttedPrice}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="pr-4 py-4">
                <label className="block text-sm font-medium text-white">Stock</label>
              </td>
              <td className="py-4">
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="pr-4 py-4">
                <label className="block text-sm font-medium text-white">Warranty (years)</label>
              </td>
              <td className="py-4">
                <input
                  type="number"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="pr-4 py-4">
                <label className="block text-sm font-medium text-white">Brand Name</label>
              </td>
              <td className="py-4">
                <input
                  type="text"
                  name="brand.name"
                  value={formData.brand.name}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="pr-4 py-4">
                <label className="block text-sm font-medium text-white">Upload Images</label>
              </td>
              <td className="py-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadingImages && (
                  <div className="mt-2 text-sm text-white flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading images...
                  </div>
                )}
              </td>
            </tr>

            {formData.images.length > 0 && (
              <tr>
                <td className="pr-4 py-4">
                  <label className="block text-sm font-medium text-white">Current Images</label>
                </td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          style={{ width: '200px', height: '200px' }}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, images: newImages }));
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )}

            <tr>
              <td className="pr-4 py-4">
                <label className="block text-sm font-medium text-white">Description</label>
              </td>
              <td className="py-4">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  style={{ minHeight: '200px', minWidth: '600px' }}
                  rows="3"
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="pr-4 py-4">
                <label className="block text-sm font-medium text-white">Highlights</label>
              </td>
              <td className="py-4">
                <textarea
                  name="highlights"
                  value={formData.highlights.join('\n')}
                  onChange={(e) => {
                    const highlights = e.target.value.split('\n').filter(h => h.trim());
                    setFormData(prev => ({ ...prev, highlights }));
                  }}
                  className="w-full p-2.5 border border-gray-700 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  style={{ minHeight: '200px', minWidth: '600px' }}
                  rows="3"
                  placeholder="Enter highlights (one per line)"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-black rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            disabled={uploadingImages}
          >
            {uploadingImages ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </div>
            ) : (
              editingId ? 'Update Property' : 'Add Property'
            )}
          </button>
        </div>
      </form>


      {/* Properties List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[220px]">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[200px]">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[100px]">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">Brand</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {properties.map((property) => (
              <tr key={property._id} className="hover:bg-gray-800">
                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0].url}
                        alt={property.name}
                        style={{ width: '200px', height: '200px' }}
                        className="rounded object-cover"
                      />
                    ) : (
                      <img
                        src={require("../images/properties/default-property.webp")}
                        alt="Default property"
                        style={{ width: '200px', height: '200px' }}
                        className="rounded object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-white">{property.name}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-white">{property.category}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-white">${property.price}</div>
                  <div className="text-sm text-white line-through">${property.cuttedPrice}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-white">{property.stock}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-white">{property.brand.name}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(property)}
                      className="px-3 py-1 bg-blue-500 text-black rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="px-3 py-1 bg-red-500 text-black rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyManagement; 