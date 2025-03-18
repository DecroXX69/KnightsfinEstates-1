import React, { useState, useEffect, useContext } from 'react';
import styles from './PropertyForm.module.css';
import AuthContext from './AuthContext.jsx';

const PropertyForm = ({ initialValues, isEditing = false, onSuccess }) => {
  const { isAuthenticated, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    status: 'pending',
    developer: '',
    buildingName: '',
    price: '',
    location: '',
    area: '',
    type: 'sale',
    image: null,
    bedrooms: '',
    baths: '',
    propertyType: '',
    description: '',
    coordinates: { lat: 25.276987, lng: 55.296249 },
    locality: '',
    amenities: '',
    floorPlan: null,
    brochureURL: '',
    LegalDocURL: '',
    paymentPlan: { onBooking: '', duringConstruction: '', onHandover: '', postHandover: '' },
    slug: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    reraApproved: false,
    reraNumber: '',
    images: [], // Ensure this is always an array
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      const amenitiesString = Array.isArray(initialValues.amenities)
        ? initialValues.amenities.join(', ')
        : initialValues.amenities || '';
      const metaKeywordsString = Array.isArray(initialValues.metaKeywords)
        ? initialValues.metaKeywords.join(', ')
        : initialValues.metaKeywords || '';

      // Ensure images is always an array, defaulting to [] if undefined/null
      const imagesArray = Array.isArray(initialValues.images) ? initialValues.images : [];

      setFormData({
        ...initialValues,
        amenities: amenitiesString,
        metaKeywords: metaKeywordsString,
        image: null, // Reset file input for editing
        imagePreviewUrl: initialValues.image,
        paymentPlan: {
          onBooking: initialValues.paymentPlan?.onBooking || '',
          duringConstruction: initialValues.paymentPlan?.duringConstruction || '',
          onHandover: initialValues.paymentPlan?.onHandover || '',
          postHandover: initialValues.paymentPlan?.postHandover || '',
        },
        coordinates: {
          lat: initialValues.coordinates?.lat || 25.276987,
          lng: initialValues.coordinates?.lng || 55.296249,
        },
        images: imagesArray, // Set images to a guaranteed array
      });

      setPreviewImages([
        ...(initialValues.image ? [initialValues.image] : []),
        ...imagesArray,
      ]);
      setFloorPlanPreview(initialValues.floorPlan || null);
    }
  }, [initialValues]);

  const cloudinaryUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'Upload failed');
      return result.secure_url;
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: file, imagePreviewUrl: e.target.result });
        setErrors({ ...errors, image: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFloorPlanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, floorPlan: file });
        setFloorPlanPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      // Ensure formData.images is always an array before spreading
      const currentImages = Array.isArray(formData.images) ? formData.images : [];
      setFormData({ ...formData, images: [...currentImages, ...files] });

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImages((prev) => [...prev, e.target.result]);
        reader.readAsDataURL(file);
      });
    }
  };

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleBuildingNameChange = (e) => {
    const buildingName = e.target.value;
    setFormData({
      ...formData,
      buildingName,
      slug: formData.slug === '' ? generateSlug(buildingName) : formData.slug,
    });
    setErrors({ ...errors, buildingName: buildingName ? '' : 'Building Name is required' });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      developer: 'Developer is required',
      buildingName: 'Building Name is required',
      price: 'Price is required',
      location: 'Location is required',
      area: 'Area is required',
      type: 'Type is required',
      bedrooms: 'Bedrooms is required',
      propertyType: 'Property Type is required',
      description: 'Description is required',
      locality: 'Locality is required',
      slug: 'Slug is required',
    };

    if (!isEditing || !formData.imagePreviewUrl) {
      requiredFields.image = 'Main Image is required';
    }

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field] || (field === 'image' && !formData.image && !formData.imagePreviewUrl)) {
        newErrors[field] = message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      setIsLoading(true);
      setErrors({});
  
      let mainImageSecureUrl = formData.imagePreviewUrl || '';
      if (formData.image instanceof File) {
        mainImageSecureUrl = await cloudinaryUpload(formData.image);
      }
  
      const additionalImageUrls = [];
      for (const image of formData.images) {
        if (image instanceof File) {
          additionalImageUrls.push(await cloudinaryUpload(image));
        } else if (typeof image === 'string') {
          additionalImageUrls.push(image);
        }
      }
  
      let floorPlanUrl = formData.floorPlan;
      if (formData.floorPlan instanceof File) {
        floorPlanUrl = await cloudinaryUpload(formData.floorPlan);
      }
  
      const dataToSend = {
        status: formData.status,
        developer: formData.developer,
        buildingName: formData.buildingName,
        price: parseFloat(formData.price) || 0,
        location: formData.location,
        area: formData.area,
        type: formData.type,
        image: mainImageSecureUrl,
        bedrooms: formData.bedrooms,
        baths: formData.baths,
        propertyType: formData.propertyType,
        description: formData.description,
        coordinates: {
          lat: formData.coordinates.lat,
          lng: formData.coordinates.lng
        },
        locality: formData.locality,
        amenities: formData.amenities ? formData.amenities.split(',').map((item) => item.trim()) : [],
        floorPlan: floorPlanUrl,
        brochureURL: formData.brochureURL,
        LegalDocURL: formData.LegalDocURL,
        paymentPlan: {
          onBooking: parseFloat(formData.paymentPlan.onBooking) || 0,
          duringConstruction: parseFloat(formData.paymentPlan.duringConstruction) || 0,
          onHandover: parseFloat(formData.paymentPlan.onHandover) || 0,
          postHandover: parseFloat(formData.paymentPlan.postHandover) || 0,
        },
        slug: formData.slug,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords
          ? formData.metaKeywords.split(',').map((item) => item.trim())
          : [],
        reraApproved: formData.reraApproved,
        reraNumber: formData.reraNumber,
        images: additionalImageUrls,
        updatedAt: new Date(),
      };
  
      if (isEditing && onSuccess) {
        onSuccess(dataToSend);
        return;
      }
  
      const response = await fetch('https://knightsfinestates-backend-1.onrender.com/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create property');
      }
  
      alert('Property created successfully!');
      setFormData({
        status: 'pending',
        developer: '',
        buildingName: '',
        price: '',
        location: '',
        area: '',
        type: 'sale',
        image: null,
        bedrooms: '',
        baths: '',
        propertyType: '',
        description: '',
        coordinates: { lat: 25.276987, lng: 55.296249 },
        locality: '',
        amenities: '',
        floorPlan: null,
        brochureURL: '',
        LegalDocURL: '',
        paymentPlan: { onBooking: '', duringConstruction: '', onHandover: '', postHandover: '' },
        slug: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        reraApproved: false,
        reraNumber: '',
        images: [],
      });
      setPreviewImages([]);
      setFloorPlanPreview(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: `Failed to save property: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const handleRemoveMainImage = () => {
    setFormData({ ...formData, image: null, imagePreviewUrl: null });
    setErrors({ ...errors, image: 'Main Image is required' });
  };

  const handleRemoveFloorPlan = () => {
    setFormData({ ...formData, floorPlan: null });
    setFloorPlanPreview(null);
  };

  return (
    <div className={styles.container}>
      <form className={styles.propertyForm} onSubmit={handleFormSubmit}>
        {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="developer">Developer:</label>
          <input
            className={`${styles.input} ${errors.developer ? styles.inputError : ''}`}
            type="text"
            id="developer"
            value={formData.developer}
            onChange={(e) => {
              setFormData({ ...formData, developer: e.target.value });
              setErrors({ ...errors, developer: e.target.value ? '' : 'Developer is required' });
            }}
          />
          {errors.developer && <span className={styles.errorText}>{errors.developer}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="buildingName">Building Name:</label>
          <input
            className={`${styles.input} ${errors.buildingName ? styles.inputError : ''}`}
            type="text"
            id="buildingName"
            value={formData.buildingName}
            onChange={handleBuildingNameChange}
          />
          {errors.buildingName && <span className={styles.errorText}>{errors.buildingName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="slug">Slug (URL friendly name):</label>
          <input
            className={`${styles.input} ${errors.slug ? styles.inputError : ''}`}
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => {
              setFormData({ ...formData, slug: e.target.value });
              setErrors({ ...errors, slug: e.target.value ? '' : 'Slug is required' });
            }}
          />
          {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
          <small className={styles.helpText}>Auto-generated from building name, but customizable</small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="price">Price:</label>
          <input
            className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
            type="number"
            id="price"
            min="0"
            value={formData.price}
            onChange={(e) => {
              setFormData({ ...formData, price: e.target.value });
              setErrors({ ...errors, price: e.target.value ? '' : 'Price is required' });
            }}
          />
          {errors.price && <span className={styles.errorText}>{errors.price}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="location">Location (city, state):</label>
          <input
            className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value });
              setErrors({ ...errors, location: e.target.value ? '' : 'Location is required' });
            }}
          />
          {errors.location && <span className={styles.errorText}>{errors.location}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="locality">Locality (e.g., Wakad, Baner):</label>
          <input
            className={`${styles.input} ${errors.locality ? styles.inputError : ''}`}
            type="text"
            id="locality"
            value={formData.locality}
            onChange={(e) => {
              setFormData({ ...formData, locality: e.target.value });
              setErrors({ ...errors, locality: e.target.value ? '' : 'Locality is required' });
            }}
          />
          {errors.locality && <span className={styles.errorText}>{errors.locality}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="area">Area (sq. ft):</label>
          <input
            className={`${styles.input} ${errors.area ? styles.inputError : ''}`}
            type="text"
            id="area"
            value={formData.area}
            onChange={(e) => {
              setFormData({ ...formData, area: e.target.value });
              setErrors({ ...errors, area: e.target.value ? '' : 'Area is required' });
            }}
          />
          {errors.area && <span className={styles.errorText}>{errors.area}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="type">Type:</label>
          <select
            className={`${styles.select} ${errors.type ? styles.inputError : ''}`}
            id="type"
            value={formData.type}
            onChange={(e) => {
              setFormData({ ...formData, type: e.target.value });
              setErrors({ ...errors, type: e.target.value ? '' : 'Type is required' });
            }}
          >
            <option value="sale">Sale</option>
            <option value="offplan">Offplan</option>
          </select>
          {errors.type && <span className={styles.errorText}>{errors.type}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="image">Main Image:</label>
          {formData.imagePreviewUrl && (
            <div className={styles.imagePreviewItem}>
              <img
                src={formData.imagePreviewUrl}
                alt="Main property"
                width="200"
                onError={(e) => (e.target.style.display = 'none')}
              />
              <button type="button" className={styles.removeImageBtn} onClick={handleRemoveMainImage}>
                ✕
              </button>
            </div>
          )}
          <input
            className={`${styles.input} ${errors.image ? styles.inputError : ''}`}
            type="file"
            id="image"
            onChange={handleMainImageUpload}
          />
          {errors.image && <span className={styles.errorText}>{errors.image}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="floorPlan">Floor Plan Image:</label>
          {floorPlanPreview && (
            <div className={styles.imagePreviewItem}>
              <img
                src={floorPlanPreview}
                alt="Floor plan"
                width="200"
                onError={(e) => (e.target.style.display = 'none')}
              />
              <button type="button" className={styles.removeImageBtn} onClick={handleRemoveFloorPlan}>
                ✕
              </button>
            </div>
          )}
          <input className={styles.input} type="file" id="floorPlan" onChange={handleFloorPlanUpload} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="bedrooms">Bedrooms:</label>
          <input
            className={`${styles.input} ${errors.bedrooms ? styles.inputError : ''}`}
            type="number"
            id="bedrooms"
            min="0"
            value={formData.bedrooms}
            onChange={(e) => {
              setFormData({ ...formData, bedrooms: e.target.value });
              setErrors({ ...errors, bedrooms: e.target.value ? '' : 'Bedrooms is required' });
            }}
          />
          {errors.bedrooms && <span className={styles.errorText}>{errors.bedrooms}</span>}
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
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="propertyType">Property Type:</label>
          <select
            className={`${styles.select} ${errors.propertyType ? styles.inputError : ''}`}
            id="propertyType"
            value={formData.propertyType}
            onChange={(e) => {
              setFormData({ ...formData, propertyType: e.target.value });
              setErrors({ ...errors, propertyType: e.target.value ? '' : 'Property Type is required' });
            }}
          >
            <option value="">Select</option>
            <option value="Villa">Villa</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Apartment">Apartment</option>
          </select>
          {errors.propertyType && <span className={styles.errorText}>{errors.propertyType}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="description">Description:</label>
          <textarea
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors({ ...errors, description: e.target.value ? '' : 'Description is required' });
            }}
          />
          {errors.description && <span className={styles.errorText}>{errors.description}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="additionalImages">Additional Images:</label>
          {previewImages.length > 0 && (
            <div className={styles.imagesGrid}>
              {previewImages.map((imgUrl, index) => (
                index > 0 && (
                  <div key={index} className={styles.imagePreviewItem}>
                    <img
                      src={imgUrl}
                      alt={`Property ${index}`}
                      width="150"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <button type="button" className={styles.removeImageBtn} onClick={() => handleRemoveImage(index - 1)}>
                      ✕
                    </button>
                  </div>
                )
              ))}
            </div>
          )}
          <input type="file" id="additionalImages" multiple onChange={handleAdditionalImagesUpload} />
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
          <label className={styles.label} htmlFor="brochureURL">Brochure URL:</label>
          <input
            className={styles.input}
            type="text"
            id="brochureURL"
            value={formData.brochureURL}
            onChange={(e) => setFormData({ ...formData, brochureURL: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="LegalDocURL">Legal Document URL:</label>
          <input
            className={styles.input}
            type="text"
            id="LegalDocURL"
            value={formData.LegalDocURL}
            onChange={(e) => setFormData({ ...formData, LegalDocURL: e.target.value })}
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
                    coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) || 25.276987 },
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
                    coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) || 55.296249 },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <h4 className={styles.paymentPlanHeading}>SEO Information</h4>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="metaTitle">Meta Title:</label>
            <input
              className={styles.input}
              type="text"
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="metaDescription">Meta Description:</label>
            <textarea
              className={styles.textarea}
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="metaKeywords">Meta Keywords (comma-separated):</label>
            <input
              className={styles.input}
              type="text"
              id="metaKeywords"
              value={formData.metaKeywords}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <h4 className={styles.paymentPlanHeading}>RERA Information</h4>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="reraApproved"
              checked={formData.reraApproved}
              onChange={(e) => setFormData({ ...formData, reraApproved: e.target.checked })}
            />
            <label className={styles.checkboxLabel} htmlFor="reraApproved">RERA Approved</label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="reraNumber">RERA Number:</label>
            <input
              className={styles.input}
              type="text"
              id="reraNumber"
              value={formData.reraNumber}
              onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
            />
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