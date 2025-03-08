import React, { useState } from 'react';
import styles from './PropertyForm.module.css';

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

      const response = await fetch('https://knightsfinestates-backend-1.onrender.com/api/properties', {
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
    <div className={styles.container}>
    <h2 className={styles.heading}>Create New Property</h2>
    <form className={styles.propertyForm} onSubmit={handleFormSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="developer">Developer:</label>
        <input
          className={styles.input}
          type="text"
          id="developer"
          value={formData.developer}
          onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="buildingName">Building Name:</label>
        <input
          className={styles.input}
          type="text"
          id="buildingName"
          value={formData.buildingName}
          onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="price">Price:</label>
        <input
          className={styles.input}
          type="number"
          id="price"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="location">Location:</label>
        <input
          className={styles.input}
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="area">Area:</label>
        <input
          className={styles.input}
          type="text"
          id="area"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="type">Type:</label>
        <select
          className={styles.select}
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        >
          <option value="sale">Sale</option>
          <option value="offplan">Offplan</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="image">Main Image:</label>
        <input
          className={styles.input}
          type="file"
          id="image"
          onChange={handleMainImageUpload}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="bedrooms">Bedrooms:</label>
        <input
          className={styles.input}
          type="number"
          id="bedrooms"
          min="0"
          value={formData.bedrooms}
          onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="propertyType">Property Type:</label>
        <select
          className={styles.select}
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

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="description">Description:</label>
        <textarea
          className={styles.textarea}
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="additionalImages">Additional Images:</label>
        <input
            type="file"
            id="additionalImages"
            multiple
            onChange={handleAdditionalImagesUpload}
          />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="amenities">Amenities (comma-separated):</label>
        <input
          className={styles.input}
          type="text"
          id="amenities"
          value={formData.amenities}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <h4 className={styles.paymentPlanHeading}>Payment Plan</h4>
        <div className={styles.paymentPlanGroup}>
          <div className={styles.paymentField}>
            <label className={styles.label} htmlFor="onBooking">On Booking:</label>
            <input
              className={styles.input}
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
          <div className={styles.paymentField}>
            <label className={styles.label} htmlFor="duringConstruction">During Construction:</label>
            <input
              className={styles.input}
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
          <div className={styles.paymentField}>
            <label className={styles.label} htmlFor="onHandover">On Handover:</label>
            <input
              className={styles.input}
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
          <div className={styles.paymentField}>
            <label className={styles.label} htmlFor="postHandover">Post Handover:</label>
            <input
              className={styles.input}
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
      </div>

      <button 
        className={isLoading ? `${styles.button} ${styles.buttonDisabled}` : styles.button} 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Create Property'}
      </button>
    </form>
  </div>
  );
};

export default PropertyForm;