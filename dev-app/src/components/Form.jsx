import React, { useState, useEffect, useContext } from 'react';
import styles from './PropertyForm.module.css';
import AuthContext from './AuthContext.jsx';

const PropertyForm = ({ initialValues, isEditing = false, onSuccess }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    developer: '',
    buildingName: '',
    price: 0,
    location: '',
    area: '',
    type: 'sale',
    image: null, // Will store file object for new uploads
    bedrooms: '',
    baths: '',
    propertyType: '',
    createdAt: new Date(),
    images: [], // Will store file objects for new additional images
    description: '',
    coordinates: {
      lat: 25.276987,
      lng: 55.296249
    },
    locality: '',
    amenities: '',
    paymentPlan: {
      onBooking: 0,
      duringConstruction: 0,
      onHandover: 0,
      postHandover: 0,
    },
  });
  const [previewImages, setPreviewImages] = useState([]); // For displaying previews
  const [isLoading, setIsLoading] = useState(false);

  // Populate form with initial values when editing
  useEffect(() => {
    if (initialValues) {
      // Format amenities from array to string for form display
      const amenitiesString = Array.isArray(initialValues.amenities) 
        ? initialValues.amenities.join(', ') 
        : initialValues.amenities || '';
      
      // Prepare initial preview images from existing property
      const initialPreviewImages = [
        ...(initialValues.image ? [initialValues.image] : []),
        ...(initialValues.images || [])
      ];

      setFormData({
        ...initialValues,
        amenities: amenitiesString,
        imagePreviewUrl: initialValues.image,
        // Ensure payment plan values are present
        paymentPlan: {
          onBooking: initialValues.paymentPlan?.onBooking || 0,
          duringConstruction: initialValues.paymentPlan?.duringConstruction || 0,
          onHandover: initialValues.paymentPlan?.onHandover || 0,
          postHandover: initialValues.paymentPlan?.postHandover || 0,
        },
        // Ensure coordinates values are present
        coordinates: {
          lat: initialValues.coordinates?.lat || 25.276987,
          lng: initialValues.coordinates?.lng || 55.296249
        }
      });

      setPreviewImages([
        ...(initialValues.image ? [initialValues.image] : []),
        ...(initialValues.images || [])
      ]);
    }
  }, [initialValues]);

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
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          image: file,
          imagePreviewUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setFormData({ ...formData, images: [...formData.images, ...files] });
      
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImages(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
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
      formData.bedrooms,
      formData.propertyType,
      formData.description,
      formData.locality,
    ];
    
    // When editing, don't require image if it's already set
    if (!isEditing || !formData.image) {
      requiredFields.push(formData.image);
    }

    if (requiredFields.some((field) => !field)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);

      // Upload main image if it's a file
      let mainImageSecureUrl = formData.imagePreviewUrl || '';
      if (formData.image instanceof File) {
        const result = await cloudinaryUpload(formData.image);
        mainImageSecureUrl = result.secure_url;
      }
  
      // Upload additional images
      const additionalImageUrls = [];
      for (const image of formData.images) {
        if (image instanceof File) {
          const result = await cloudinaryUpload(image);
          additionalImageUrls.push(result.secure_url);
        } else if (typeof image === 'string') {
          additionalImageUrls.push(image);
        }
      }

      const dataToSend = {
        ...formData,
        image: mainImageSecureUrl,
        images: additionalImageUrls,
        amenities: formData.amenities.split(',').map((item) => item.trim()),
        paymentPlan: {
          ...formData.paymentPlan,
          onBooking: parseFloat(formData.paymentPlan.onBooking),
          duringConstruction: parseFloat(formData.paymentPlan.duringConstruction),
          onHandover: parseFloat(formData.paymentPlan.onHandover),
          postHandover: parseFloat(formData.paymentPlan.postHandover),
        },
      };

      // For editing, we'll pass the data back to the parent component
      if (isEditing && onSuccess) {
        onSuccess(dataToSend);
        return;
      }

      // For creating a new property
      const response = await fetch('https://knightsfinestates-backend-1.onrender.com/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('Property created successfully!');
        // Reset form after successful creation
        setFormData({
          developer: '',
          buildingName: '',
          price: 0,
          location: '',
          area: '',
          type: 'sale',
          image: null,
          bedrooms: '',
          baths: '',
          propertyType: '',
          createdAt: new Date(),
          images: [],
          description: '',
          coordinates: {
            lat: 25.276987,
            lng: 55.296249
          },
          locality: '',
          amenities: '',
          paymentPlan: {
            onBooking: 0,
            duringConstruction: 0,
            onHandover: 0,
            postHandover: 0,
          },
        });
        setPreviewImages([]);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create property');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save property. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove an image from the additional images array
  const handleRemoveImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
    setPreviewImages(previewImages.filter((_, index) => index !== indexToRemove));
  };

  // Function to remove the main image
  const handleRemoveMainImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreviewUrl: null
    });
  };

  return (
    <div className={styles.container}>
      {/* {!isEditing && <h2 className={styles.heading}>Create New Property</h2>} */}
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
          <label className={styles.label} htmlFor="location">Location (city name, state):</label>
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
          <label className={styles.label} htmlFor="locality">Locality (eg. wakad, baner):</label>
          <input
            className={styles.input}
            type="text"
            id="locality"
            value={formData.locality}
            onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="area">Area (sq. ft):</label>
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
          {formData.imagePreviewUrl && (
            <div className={styles.imagePreviewItem}>
              <img
                src={formData.imagePreviewUrl}
                alt="Main property"
                width="200"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <button 
                type="button" 
                className={styles.removeImageBtn}
                onClick={handleRemoveMainImage}
              >
                ✕
              </button>
            </div>
          )}
          <input
            className={styles.input}
            type="file"
            id="image"
            onChange={handleMainImageUpload}
            required={!isEditing || !formData.image}
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
          <label className={styles.label} htmlFor="baths">Baths:</label>
          <input
            className={styles.input}
            type="number"
            id="baths"
            min="0"
            value={formData.baths}
            onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
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
          {previewImages.length > 1 && (
            <div className={styles.imagesGrid}>
              {previewImages.slice(1).map((imgUrl, index) => (
                <div key={index} className={styles.imagePreviewItem}>
                  <img
                    src={imgUrl}
                    alt={`Property ${index}`}
                    width="150"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <button 
                    type="button" 
                    className={styles.removeImageBtn}
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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

        <div className={styles.formGroup}>
          <h4 className={styles.paymentPlanHeading}>Coordinates</h4>
          <div className={styles.paymentPlanGroup}>
            <div className={styles.paymentField}>
              <label className={styles.label} htmlFor="lat">Latitude:</label>
              <input
                className={styles.input}
                type="number"
                step="any"
                id="lat"
                value={formData.coordinates.lat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) },
                  })
                }
              />
            </div>
            <div className={styles.paymentField}>
              <label className={styles.label} htmlFor="lng">Longitude:</label>
              <input
                className={styles.input}
                type="number"
                step="any"
                id="lng"
                value={formData.coordinates.lng}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) },
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
          {isLoading ? 'Submitting...' : isEditing ? 'Update Property' : 'Create Property'}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;