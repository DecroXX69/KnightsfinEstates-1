import React, { useState } from 'react';
import  './form.css';

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    developer: '',
    buildingName: '',
    price: 0,
    location: '',
    area: '',
    type: 'sale',
    image: '',
    bedrooms: '',
    propertyType: '',
    description: '',
    images: [],
    amenities: '',
    paymentPlan: {
      onBooking: 0,
      duringConstruction: 0,
      onHandover: 0,
      postHandover: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const cloudinaryUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${result.error.message}`);
    }
    return result;
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const result = await cloudinaryUpload(file);
        setFormData({ ...formData, image: result.secure_url });
      } catch (error) {
        console.error('Upload Error:', error);
        setFormData({ ...formData, image: '' });
        alert('Main image upload failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      try {
        setIsLoading(true);
        const results = await Promise.all(
          files.map(async (file) => {
            const result = await cloudinaryUpload(file);
            return result.secure_url;
          })
        );
        setFormData({ ...formData, images: results });
      } catch (error) {
        console.error('Upload Error:', error);
        setFormData({ ...formData, images: [] });
        alert('Additional images upload failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      formData.developer,
      formData.buildingName,
      formData.price,
      formData.location,
      formData.area,
      formData.type,
      formData.image,
      formData.bedrooms,
      formData.propertyType,
      formData.description,
    ];

    if (requiredFields.some((field) => !field)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);

      const dataToSend = {
        ...formData,
        amenities: formData.amenities.split(',').map((item) => item.trim()),
        paymentPlan: {
          ...formData.paymentPlan,
          onBooking: parseFloat(formData.paymentPlan.onBooking),
          duringConstruction: parseFloat(formData.paymentPlan.duringConstruction),
          onHandover: parseFloat(formData.paymentPlan.onHandover),
          postHandover: parseFloat(formData.paymentPlan.postHandover),
        },
        images: formData.images.filter((url) => url),
      };

      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('Property created successfully!');
        setFormData({
          developer: '',
          buildingName: '',
          price: 0,
          location: '',
          area: '',
          type: 'sale',
          image: '',
          bedrooms: '',
          propertyType: '',
          description: '',
          images: [],
          amenities: '',
          paymentPlan: {
            onBooking: 0,
            duringConstruction: 0,
            onHandover: 0,
            postHandover: 0,
          },
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create property');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to create property. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Create New Property</h2>
      <form className="property-form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="developer">Developer:</label>
          <input
            type="text"
            id="developer"
            value={formData.developer}
            onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="buildingName">Building Name:</label>
          <input
            type="text"
            id="buildingName"
            value={formData.buildingName}
            onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="area">Area:</label>
          <input
            type="text"
            id="area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="sale">Sale</option>
            <option value="offplan">Offplan</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Main Image:</label>
          <input
            type="file"
            id="image"
            onChange={handleMainImageUpload}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms:</label>
          <input
            type="number"
            id="bedrooms"
            min="0"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="propertyType">Property Type:</label>
          <select
            id="propertyType"
            value={formData.propertyType}
            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            required
          >
            <option value="">Select</option>
            <option value="Villa">Villa</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalImages">Additional Images:</label>
          <input
            type="file"
            id="additionalImages"
            multiple
            onChange={handleAdditionalImagesUpload}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amenities">Amenities (comma-separated):</label>
          <input
            type="text"
            id="amenities"
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          />
        </div>

        <div className="form-group">
          <h4>Payment Plan</h4>
          <div>
            <label htmlFor="onBooking">On Booking:</label>
            <input
              type="number"
              id="onBooking"
              min="0"
              value={formData.paymentPlan.onBooking}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentPlan: { ...formData.paymentPlan, onBooking: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label htmlFor="duringConstruction">During Construction:</label>
            <input
              type="number"
              id="duringConstruction"
              min="0"
              value={formData.paymentPlan.duringConstruction}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentPlan: { ...formData.paymentPlan, duringConstruction: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label htmlFor="onHandover">On Handover:</label>
            <input
              type="number"
              id="onHandover"
              min="0"
              value={formData.paymentPlan.onHandover}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentPlan: { ...formData.paymentPlan, onHandover: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label htmlFor="postHandover">Post Handover:</label>
            <input
              type="number"
              id="postHandover"
              min="0"
              value={formData.paymentPlan.postHandover}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentPlan: { ...formData.paymentPlan, postHandover: e.target.value },
                })
              }
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Create Property'}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;